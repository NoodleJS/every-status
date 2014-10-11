var express = require('express');
var router = express.Router();

var con = require('../controller/users')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/login/:type', con.login);

router.get('/logout', con.logout);

router.get('/:id', con.show);

module.exports = router;
