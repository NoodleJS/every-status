var express = require('express');
var router = express.Router();
var con = require('../controller/users');
var mock = require('../controller/mock');

router.get('/', function(req, res) {
    res.render('new/layout', {});
})

router.get('/showSession', function(req, res) {
    
    res.render('console', {
        message: 'Session',
        content: JSON.stringify(req.session, null, 2)
    })
})


router.get('/showPieces', function(req, res) {

    var Piece = require('../model/piece');

    req.session.user = req.session.user || {}

    Piece.find({author: req.session.user._id},function(err, pieces) { 
        if (err) throw err
        res.render('console', {
            message: 'Pieces',
            content: JSON.stringify(pieces, null, 2)
        })    
    })
    
})

//router.get('/markdown')

router.get('/markdown', mock.markDown)

router.get('/wb', function(req, res) {
    res.render('wb')
})

module.exports = router;
