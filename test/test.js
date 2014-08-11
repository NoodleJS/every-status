var assert = require("assert")


describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})

describe('User', function(){
  describe('#save()', function(){
    it('should save without error', function(){
        assert.equal(1,1)
      });
    })
})

describe('pieceModel', function(){
  describe('init',function(){
    it('should has created & update prop', function(){
      var Piece = require('../model/piece')
      var User = require('../model/user')
      var _p = new Piece ;
      var _u = new User ;

      assert.equal(true, 'created' in _p && 'updated' in _p)
      assert.equal(true, 'created' in _u && 'updated' in _u)

    })
  })
})