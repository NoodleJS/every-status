'use strict';
var Router = require('koa-router');
var ajax = require('../controllers/temp');

var router = new Router();

router.get('/', ajax.temp);

// module.exports = function() {

//   return router.middleware();  
// }

module.exports = router.middleware();  
