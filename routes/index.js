var express = require('express');
var router = express.Router();

var con = require('../controller/pieces');
var user = require('../controller/users');
var mock = require('../controller/mock');
var connect = require('../proxy/connect');
var login = require('../proxy/authorize');

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


router.get('/', login.shouldLogin ,function(req, res) {
    //index 页面 
    //res.render('add', { title: '此刻...', name: 'add'})
    
    res.redirect('/add');
})

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

router.get('/pieces', con.list);

router.get('/piece/:id', con.show);

module.exports = router;
