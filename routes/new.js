var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '../public/polymer/index/', 'index.html'));
})

module.exports = router;