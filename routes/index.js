var express = require('express');
var router = express.Router();

rule_map = {
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


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '茴香' , name: 'index'});
});

module.exports = router;
