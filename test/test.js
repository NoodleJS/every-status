var assert = require("assert")
var db = require('../proxy/index')
var mock = require('../controller/mock') 


describe('Database', function(){

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

    describe('increment', function(done) {
        it('should has an increment id', function(done) {
            var Piece = require('../model/piece');
            var _t1;
            var _t2;
            
                new Piece({}).save(function(err,piece) {

                    _t1 = piece

                    new Piece({}).save(function(err,piece) {

                        _t2 = piece
                        assert.equal(true,_t1.id == _t2.id - 1)
                        done()

                    })
                })
        })
    })
})

describe('GodModel', function() {
    var user = {}

    //confirm user 
    before(function() {

        var User = require('../model/user');

        User.findOne( function(err, it ) {
            user = it;
            if ( user && user.name != 'elrrrrrrr') {
                mock.addUser()
            }
        })


    })
    
    //do test
    it('should has global God', function() {
        mock.godModel(null, null, function() {
            assert(true, 'elrrrrrrr', global.God)
        })
    })

})