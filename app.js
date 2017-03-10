var express = require('express');
var app = express();
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var makesRouter = require('./routes');
var fs = require('fs');
var path = require('path');
//what is NPM mime?
// var mime = require('mime');
var bodyParser = require('body-parser');
// var socketio = require('socket.io');

// Q:Instead of npm install --save express, is there a way to get all of our required packages after declaring required packages in app.js?

//nunjucks allows us to  %fillintheblank% ['stacey']
nunjucks.configure('views', {noCache: true});
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
app.use(function (req, res, next) {
    console.log(chalk.red(req.method) + ' ' + chalk.blue(req.route));
    next();
})
//logging middleware
app.use(morgan('dev'))


// Always put the listener last
app.listen(3000, function(){
    console.log('server listening');
})

