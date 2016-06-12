var express 		= require('express'),
	app				= express(),
	bodyParser 		= require('body-parser'),
	morgan			= require('morgan'),
	mongoose		= require('mongoose'),
	path			= require('path'),
	jwt				= require('jsonwebtoken'),
	nev 			= require('email-verification'),
	config			= require('./server-config');

//---------Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//---------Middleware for CORS requests

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers','X-Requested-With, \
Authorization');

	next();
});

//---------Set up Database Connection

mongoose.connect(config.database);


//LOG ALL REQUESTS TO CONSOLE
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

