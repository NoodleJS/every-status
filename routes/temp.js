var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

    var fakeuser = {
        avatar: 'http://tp1.sinaimg.cn/2017654444/50/5635300102/1', 
        name: 'elrrrrrrr',
        id: 1,
        douban_access_token:'12345'
    }
    var fakepiece = {
        id: 1,
        content: 'Lets start from here',
        author_name: 'elrrrrrrr', 
        work_title: 'Just for fun',
        addtime: '2014-08-20'
    }
    
    res.render('user', { title: '今天...', 
        name: 'people',
        user: fakeuser,
        current: fakeuser, 
        pages: 1,
        index: 1,
        favs:[fakepiece,fakepiece]
    })  
})

router.get('/showSession', function(req, res) {
    res.render('console', {
        message: 'Session',
        content: JSON.stringify(req.session)
    })
})
module.exports = router;
