var express = require('express');
var router = express.Router();
var con = require('../controller/users');

router.get('/', function(req, res) {
    
})

router.get('/showSession', function(req, res) {
    
    res.render('console', {
        message: 'Session',
        content: JSON.stringify(req.session)
    })
})

router.get('/showPieces', function(req, res) {

    var Piece = require('../model/piece');

    req.session.user = req.session.user || {}

    Piece.find({author: req.session.user._id},function(err, pieces) { 
        if (err) throw err
        
        res.render('console', {
            message: 'Pieces',
            content: JSON.stringify(pieces)
        })    
    })
    
})

router.get('/fav/:id', con.fav)

router.get('/wb', function(req, res) {
    res.render('wb')
})
module.exports = router;
