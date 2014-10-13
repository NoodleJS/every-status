var express = require('express');
var router = express.Router();

var con = require('../controller/ajax');

router.get('/pieces', con.index) ;


module.exports = router;
