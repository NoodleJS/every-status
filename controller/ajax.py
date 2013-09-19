#encoding=utf-8
import web
import requests
import traceback
from datetime import datetime
from config import setting
from model import user
import urllib
from util import login
from util import oauth
import json

config = setting.config
render = setting.render
db = setting.db

def common_check(post=[],get=[],need_login=True):
    """ request decorator """
    def check(post,get):
        """ 检查登录与否及参数 """
        post_data = web.input(_method="post")
        get_data = web.input(_method="get")
        user = None
        if need_login:
            user = login.logged()
            if not user:
                raise Exception(json.dumps({"code":403,"msg":"access deny"}))

        for k in post:
            if not k in post_data:
                raise Exception(json.dumps({"code":500,"msg":str(k)+" is required"}))

        for k in get:
            if not k in get_data:
                raise Exception(json.dumps({"code":500,"msg":str(k)+" is required"}))

        return {"post":post_data,"get":get_data,"user":user}

    def checkwrap(fn):
        def inner(self):
            try:
                ctx = check(post,get)
                return ok(msg=fn(self,ctx))
            except Exception, e:
                traceback.print_exc()
                return e
        return inner
    return checkwrap

def ok(msg="ok"):
    return json.dumps({"code":200,"msg":msg})

def fail(msg="fail"):
    return json.dumbs({"code":500,"msg":msg})

def unfavpiece(pieceid,userid):
    where={"pieceid":pieceid,"userid":userid}
    row = db.select("fav",where="pieceid=$pieceid and userid=$userid",vars=where)
    if not row:
        raise Exception(json.dumps({"code":300,"msg":"you've not faved this piece"}))

    db.delete("fav",where="pieceid=$pieceid and userid=$userid",vars=where)

def favpiece(pieceid,userid):
    row = db.select("fav",where="pieceid=$pieceid and userid=$userid",vars={"pieceid":pieceid,"userid":userid})

    if row:
        raise Exception(json.dumps({"code":200,"msg":{"id":row[0]["id"]}}))

    piece = db.select("piece",where="id=$id",vars={"id":pieceid})
    if not piece:
        raise Exception(json.dumps({"code":500,"msg":"invalid piece id"}))

    db.insert("fav",pieceid=pieceid,userid=userid,addtime=datetime.now())

class add:
    @common_check(post=["content"])
    def POST(self,ctx):
        """ add one """
        content = ctx["post"]["content"]
        userid = ctx["user"]["id"]
        if "link" in ctx["post"]:
            link = ctx["post"]["link"]
        else:
            link = None

        pieces = db.select("piece",where="content=$content",vars={"content":content})
        # 检查是否已有相同内容
        if not pieces:
            pieceid = db.insert("piece",content=content,user=userid,addtime=datetime.now(),link=link)
        else:
            pieceid = pieces[0]["id"]

        share = []
        if "share" in ctx["post"]:
            share = ctx["post"]["share"].split(",")

        for key in share:
            if not key: 
                continue
            client = oauth.createClientWithName(key,ctx["user"])
            post_content = u"「" + content + u"」" + " http://" + web.ctx.host + "/piece/" + str(pieceid)
            client.post(post_content)

        favpiece(pieceid,userid)

        return {"id":pieceid}

class fav:
    @common_check(post=["pieceid"])
    def POST(self,ctx):
        """ fav a piece """
        pieceid=ctx["post"]["pieceid"]
        favpiece(pieceid,ctx["user"]["id"])
        return {"id":pieceid}

class userinfo:
    @common_check()
    def GET(self,ctx):
        user = ctx["user"]
        return {"name":user["name"],"id":user["id"],"avatar":user["avatar"]}

class myfavs:
    @common_check()
    def GET(self,ctx):
        input = web.input()
        id = ctx["user"]["id"]
        if "per" in input:
            per = input["per"] or 5
        else:
            per = 5

        try:
            page = int(web.input(page=1)["page"])
        except Exception, e:
            page = 1

        if page < 1:
            page = 1

        vars = {"id":id}

        where = "fav.userid=user.id and fav.pieceid=piece.id and user.id=$id"

        favs = db.select(["fav","piece","user"]
            ,what="avatar,piece.id,piece.content,fav.addtime"
            ,where=where
            ,vars=vars,limit=per
            ,offset=(page-1) * per
            ,order="addtime DESC")

        favs = list(favs)
        for item in favs:
            item["addtime"] = item["addtime"].strftime('%Y-%m-%d')

        return favs

class authuser:
    @common_check(post=["name","access_token"],need_login=False)
    def POST(self,ctx):
        name = ctx["post"]["name"]
        access_token = ctx["post"]["access_token"]


        ret_user = None
        client_token = None
        cur_user = login.logged()

        client = oauth.createClientWithName(name)
        user_info = client.get_current_user_info(access_token)

        user_info["access_token"] = access_token

        if cur_user:
            print cur_user
            user.update_oauth_userid(name,cur_user["id"],user_info["id"])
            user.update_access_token(name,user_info["id"],access_token)
        if not cur_user:
            print "not cur_user"
            oauth_user = user.exist_oauth_user(name,user_info)
            if not oauth_user:
                ret_user = user.new_oauth_user(name,user_info)
            else:
                ret_user = oauth_user
                user.update_access_token(name,oauth_user[name+"_id"],access_token)
            client_token = user.login_oauth_user(name,user_info)

        ret_user["client_hash"] = client_token
        return ret_user 


class unfav:
    @common_check(post=["pieceid"])
    def POST(self,ctx):
        """ fav a piece """
        unfavpiece(ctx["post"]["pieceid"],ctx["user"]["id"])
        return 


class pieces:
    def GET(self):
        "get pieces"
        pieces_itr = db.query('select id,content from piece where private = 0 order by rand() limit 100')
        pieces=[]
        for piece in pieces_itr:
            pieces.append(piece)
        return json.dumps(pieces)