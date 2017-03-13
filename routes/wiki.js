var router = require('express').Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User; 


router.get('/', function(req, res, next) {
    res.redirect('/');
});

router.post('/', function(req, res, next) {
    
  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`

	var page = Page.build({
	    title: req.body.title,
		content: req.body.pagecontent
	  });

	page.save();
	res.redirect('/');

    //res.json(req.body)
    //res.send('got to POST /wiki/');
});

router.get('/add', function(req, res, next) {
    res.render('addpage');
});

module.exports = router;