var express = require('express');
var router = express.Router();

var con = require('../controller/pieces');
var user = require('../controller/users');
var mock = require('../controller/mock');
var index = require('../controller/index');
var connect = require('../proxy/connect');
var login = require('../proxy/authorize');


router.get('/' , login.couldLogin, index.index);

router.get('/add', login.shouldLogin, function(req, res) {
    //渲染页面
    res.render('add', { title: '此刻...', name: 'add', user: req.session.user})
})

router.post('/add', con.create) 

router.get('/fake', mock.addUser)

router.get('/god', mock.godModel)

router.get('/pieces', login.shouldLogin, con.list);

router.get('/piece/:id', login.shouldLogin, con.show);

module.exports = router;
