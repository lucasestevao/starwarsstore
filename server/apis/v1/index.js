var express = require('express');
var authService = require('../../services/authService');
var ERRORS = require('../../utils/constants').ERRORS;

exports = module.exports = this_module;

function this_module(options){

	var appApi = express.Router();

	appApi.use('/user', require('./user')());
	appApi.use('/auth', require('./auth')());

	appApi.use(function(req,res,next){
		if(/^\/(me|users|user)/.test(req.url)) {
			authService.get(req.header('x-auth')).then(function (auth) {
				(req.payload || (req.payload = {})).auth = auth;
				next();
			}, function (err) {
				res.status((err && err.httpStatus) || ERRORS.unknown.httpStatus).json(err || ERRORS.unknown);
			});
		} else {
			next();
		}
	});

	appApi.get('/me', function(req, res) {
		res.json(req.payload.auth);
	});

	return appApi;
}