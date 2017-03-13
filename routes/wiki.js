var router = require('express').Router();
var models = require('../models');
var Page = models.Page; 
var User = models.User;

router.get('/', function(req, res, next) {
	  Page.findAll()
	  .then(function(foundPages){
			//console.log('Foundpages: ', foundPages[0]);
			res.render('index', {pages: foundPages});
	  })
	  .catch(next);
});

router.post('/', function(req, res, next) {
	//check if user exists, if not, build a new user
	// var author = User.build({
	// 	name: req.body.author,
	// 	email: req.body.email
	// });
	// author.save()
	// 	.then(function(savedAuthor){
	// 		console.log(savedAuthor);
	// 	})
	// 	.catch(next);
	
	User.findOrCreate({
			where: {
				email: req.body.email,
				name: req.body.name
		}
	})
		.spread(function(user, wasCreated){ // if using then, returns array [pageThatWasFoundOrCreate, createdBoolean]
				return Page.create({ // create is build + save
					title: req.body.title,
					content: req.body.pagecontent,
					status: req.body.status
				}).then(function (createdPage){
					return createdPage.setAuthor(user); // need to return because this is an asynch method (because it's touching the db)
				});
		})
		.then(function(createdPage){
			res.redirect(createdPage.route);
		})
		.catch(next);

	// page.save()
	// 	.then(function(savedPage){
  // 		res.redirect(savedPage.route); // route virtual FTW
	// 		})
	// 		// shortcut?: .catch(next);
	// 		.catch(function (err){
	// 			next(err);
	// 		});

	// 	//res.json(page);
	//   //res.json(req.body)
  //   //res.send('got to POST /wiki/');
});

//this needs to be above the parameterized route so that it doesn't think there is an 'add' page
router.get('/add', function(req, res, next) {
		res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next) {
	  Page.findOne({ 
	    where: { 
	      urlTitle: req.params.urlTitle 
	    } 
	  })
	  .then(function(page){
			if(page === null) return next(new Error('That page was not found!'));
			return page.getAuthor()
				.then(function(user){
					page.author = user;					
					res.render('wikipage', {page: page});
				})	
	  })
	  .catch(next); //short form
});

module.exports = router;