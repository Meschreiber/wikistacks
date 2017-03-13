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
		content: req.body.pagecontent,
		status: req.body.status
	  });

	page.save();
	// res.redirect('/');
	res.json(page);

    //res.json(req.body)
    //res.send('got to POST /wiki/');
});

router.get('/add', function(req, res, next) {
    res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
    // res.send(req.params.urlTitle);
	  Page.findOne({ 
	    where: { 
	      urlTitle: req.params.urlTitle 
	    } 
	  })
	  .then(function(foundPage){
	    res.json(foundPage);
	  })
	  .catch(next);

});

module.exports = router;