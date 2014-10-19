var Piece = require('../model/piece');
var User = require('../model/user');

exports.index = function(req, res) {
    Piece.find({})
        .sort('-created')
        .exec(handlerData)

    function handlerData(err, set) {
        if (err) console.log(err)
        if (set) {
            res.send(set)
        }
    }
}

exports.fav = function(req, res) {
    var pieceId = req.params.id,
        user = req.session.user || {};

    if (Object.keys(user).length == 0) {
        res.redirect('/');
        return
    }

    Piece.findOne({id: pieceId}, function(err, it) {
        if (err) throw new Error('Error when find the pieces');

        if (it) {
            //自增id带来的头痛问题
            //user.favs.addToSet(it.id);
            if (user.favs.indexOf(it._id + '') > -1 ) {
                res.send({code: 500, msg:'already fav !'});
                return 
            }
            user.favs.push(it._id);
            it.fans.addToSet(user._id);
            it.save()
            res.send({
                'code': 200,
                'obj': it
             });
            syncUser(user);
        } else {
            res.send({'msg': 'no match'});
        }
    })
}

exports.nofav = function(req, res) {
    var pieceId = req.params.id,
        user = req.session.user || {};

    if (Object.keys(user).length == 0) {
        res.redirect('/');
        return
    }

    Piece.findOne({id: pieceId}, function(err, it) {
        if (err) throw new Error('Error when find the pieces');

        if (it) {
            
            var index = user.favs.indexOf(it._id + '');
            if (index == -1) {
                res.send({
                    'code': 200,
                    'msg': 'not fav'
                })
                return 
            }
            user.favs.splice(index);
            res.send({
                'code': 200,
                'msg': 'success'
            });
            syncUser(user);
        } else {
            res.send({'msg': 'no match'});
        }
    })
}

function syncUser(user){
  User.update({name: user.name}, {favs: user.favs}, function(err) {
    console.log(err)
    if (err) throw new Error('error in user ');
  })

}

