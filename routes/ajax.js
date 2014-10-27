var express = require('express');
var router = express.Router();

var con = require('../controller/ajax');

router.get('/pieces', con.index);

router.get('/fav/:id', con.fav);

router.get('/nofav/:id', con.nofav);

router.get('/delete/:id', con.delPiece);

router.post('/update', con.update);

module.exports = router;
