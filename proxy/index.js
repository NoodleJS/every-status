var mongoose = require('mongoose');
mongoose.connect('mongodb://121.40.137.124:/test');

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
});
