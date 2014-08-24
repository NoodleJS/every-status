var express = require('express');
var router = express.Router();

var con = require('../controller/pieces');
var user = require('../controller/users');
var mock = require('../controller/mock');
var connect = require('../proxy/connect');

var rule_map = {
    "page":{
        "/": "index",
        '/new': 'new',
        '/piece/(\d+)': 'piece',
        '/people/(\d+)': 'people',
        '/login': 'login',
        '/logout': 'logout',
        '/tools': 'tools',
        '/about': 'about',
        '/app': 'app',
        '/bookmarklet': 'bookmarklet',
        '/auth/(douban|weibo)': 'auth',
        '/auth/redirect/(douban|weibo)': 'auth_redirect',
    },
    //慢慢废掉
    "ajax":{
        '/userinfo':'userinfo',
        '/mine/favs':'myfavs',
        '/authuser':'authuser',
        '/add':'add',
        '/fav':'fav',
        '/unfav':'unfav',
        '/pieces':'pieces',
    },
    "api":{
        '/userinfo':'userinfo',
        '/mine/favs':'myfavs',
        '/authuser':'authuser',
        '/add':'add',
        '/fav':'fav',
        '/unfav':'unfav',
        '/remove':'remove',
        '/pieces':'pieces',
        '/upload/token':'uploadtoken',
        '/upload/callback':'uploadcallback'
    }
}

global.env == 'development' && mock.godModel()


router.get('/', function(req, res) {

    res.render('index', { title: '每思每刻' , name: 'index'});
});

router.get('/add', function(req, res) {
    //渲染页面
    res.render('add', { title: '此刻...', name: 'add'})
})

router.post('/add', con.create) 

router.get('/fake', mock.addUser)

router.get('/god', function(req, res) {
    //ugly ...
    mock.godModel(req, res, connect.sendOk)  

})

router.get('/test', function(req, res) {
    var fakeuser = {
        avatar: 'http://tp1.sinaimg.cn/2017654444/50/5635300102/1', 
        name: 'elrrrrrrr',
        id: 1,
        douban_access_token:'12345'
    }
    var fakepiece = {
        id: 1,
        content: 'Lets start from here',
        author_name: 'elrrrrrrr', 
        work_title: 'Just for fun',
        addtime: '2014-08-20'
    }
    
    res.render('user', { title: '今天...', 
        name: 'people',
        user: fakeuser,
        current: fakeuser, 
        pages: 1,
        index: 1,
        favs:[fakepiece,fakepiece]
    })  
})

router.get('/piece/:id', con.show);

module.exports = router;
