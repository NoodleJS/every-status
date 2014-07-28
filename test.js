(function() {
  var a, item, _i, _len, _ref;

  a = function() {
    return alert(1);
  };

  _ref = [1, 2, 3, 4];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    alert(item);
  }

}).call(this);
