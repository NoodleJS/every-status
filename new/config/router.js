'use strict';
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');

var router = new Router();

router.get('/', function * () {
  console.log('okk')
})

module.exports = router;