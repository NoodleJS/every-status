var express = require('express');
var router = express.Router();
var con = require('../controller/pieces');

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
  res.render('index', { title: '每思每刻' , name: 'index'});
});

router.get('/add', function(req, res) {
    //渲染页面
    //res.send()
})

router.post('/doAdd', function(req, reqs) {
    //增加逻辑
})

router.get('/show/:id',function(){
    //展现piece
})
    
//router.get('/add', con.create )

router.get('/test/:id', function(req, res) {
    console.log(req.query)
    console.log(req.params)
    res.send({msg:req.query})
    
})

router.get('/piece/:id', con.show);

module.exports = router;
