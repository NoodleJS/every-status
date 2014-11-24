var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendfile('/Users/qin/nodelab/every-status/polymer/index/index.html');
})

module.exports = router;