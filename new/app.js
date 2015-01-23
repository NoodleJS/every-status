'use strict';

var entry = require('./lib/doctor');
var app=entry.createApp({
  base: __dirname
});

if (!module.parent) {
  app.listen(3000);
}
