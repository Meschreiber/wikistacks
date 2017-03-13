var router = require('express').Router();

router.get('/', function(req, res, next) {
    res.redirect('/');
});

router.post('/', function(req, res, next) {
    res.json(req.body)
    //res.send('got to POST /wiki/');
});

router.get('/add', function(req, res, next) {
    res.render('addpage');
});

module.exports = router;