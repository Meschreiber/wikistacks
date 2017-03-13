var express = require('express');
var app = express();
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var models = require('./models');
var chalk = require('chalk');

// var mime = require('mime'); // what is this?
// var socketio = require('socket.io');
// var wikiRouter = require('./routes/wiki');  same as line 44?

// Q:Instead of npm install --save express, is there a way to get all of our required packages after declaring required packages in app.js?
//A: Yes, just install all of them at the same time

//nunjucks allows us to  %fillintheblank% ['stacey']
nunjucks.configure('views', {noCache: true});
// noCache -- good in dev --> don't remember anything!
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
app.get('/', function(req, res){
  res.render('index')
})

//body parser allows you to use the end of your url as a variable's value
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use('/', routes);//not sure we need this right now

//express.static - looks in public folder (images, resume) without having to reload entire system...don't have to hard route for each file you want to show
app.use(express.static(path.join(__dirname, 'public')));


//what this middleware does - on server side, posts results of what was requested (red) and what resulted (blue) ~ GET\ -> undefined
// app.use(function (req, res, next) {
//     console.log(chalk.red(req.method) + ' ' + chalk.blue(req.route));
//     next();
// })
//logging middleware --> this is actually a better version of what's above
app.use(morgan('dev'))

// hooks up our wikiRouter
app.use('/wiki', require('./routes/wiki'));

//set-up error handling middleware at the end of the pipeline
app.use(function(err, req, res, next){
    console.error(err);
    res.status(500).send(err.message);
});

// this syncs our db in models folder
models.User.sync({force: true})
.then(function () {
    return models.Page.sync({force: true})
})
.then(function () {
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');  // Always put the listener last
    });
})
.catch(console.error);