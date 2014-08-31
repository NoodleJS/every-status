var express = require('express');
var router = express.Router();

var con = require('../controller/pieces');
var user = require('../controller/users');
var mock = require('../controller/mock');
var connect = require('../proxy/connect');
var login = require('../proxy/authorize');


global.env == 'development' && mock.godModel()


router.get('/' ,function(req, res) {
    //index 页面 
    res.render('index', { title: '此刻...', name: 'add', user: req.session.user})
    
    //res.redirect('/add');
})

router.get('/add', login.shouldLogin, function(req, res) {
    //渲染页面
    res.render('add', { title: '此刻...', name: 'add', user: req.session.user})
})

router.post('/add', con.create) 

router.get('/fake', mock.addUser)

router.get('/god', function(req, res) {
    //ugly ...
    mock.godModel(req, res, connect.sendOk)  

})

router.get('/pieces', login.shouldLogin, con.list);

router.get('/piece/:id', con.show);

module.exports = router;
