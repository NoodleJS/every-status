var express = require('express');
var router = express.Router();

var con = require('../controller/users')

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/view/:id', con.show)

router.get('/login', con.login)

router.get('/logout', con.logout)

module.exports = router;
