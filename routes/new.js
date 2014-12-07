var express = require('express');
var path = require('path');
var router = express.Router();
var login = require('../proxy/authorize');

router.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '../public/polymer/index/', 'index.html'));
})

router.get('/or', function(req, res) {
  res.render('new/layout.jade', {});
})

module.exports = router;