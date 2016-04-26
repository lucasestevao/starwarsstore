var _ = require('underscore');
var express = require('express');
var ERRORS = require('../../../utils/constants').ERRORS;
var crypter = require('../../../utils/crypter');
var userService = require('../../../services/userService');

exports = module.exports = this_module;

function this_module(options) {

	var api = express.Router();

	api.route('/')
		.get(function(req, res) {
			var name = req.query.name || "";
			var params = {};
			if (name) {
				var email = new RegExp(name, 'i');
				name = "[/" + name.split(" ").join("/i,/") + "/i]";
				params.$or = [{
					$where: 'var s=this.name+" "+this.surname; return ' + name + '.every(function(r){return r.test(s)})'
				}, {
					email: email
				}];
			}
			return userService.listAndCount(params).spread(function(users, count) {
				res.header('X-List-Total', count).json(users);
			}, function(err) {
				res.status(ERRORS.unknown.httpStatus).json(_.extend({}, ERRORS.unauthorized, {
					original: err && err.stack || err
				}));
				console.error('[user/:userId get] error: ', err && err.stack || err);
			});
		})
		.post(function(req, res) {
			var json = req.body;
			if (json.password)
				json.password = crypter.hash(req.body.password);
			return userService.create(json).then(function(user) {
				res.json(user);
			}).catch(function(err) {
				if (err && err.code == 11000) {
					var value = err.err && err.err.match(/: "([^"]+)"/);
					res.status(ERRORS.duplicate_value.httpStatus).json(_.extend({}, ERRORS.duplicate_value, {
						value: value && value[1]
					}));
				} else {
					if (err && err.errors && err.errors && err.errors.email && err.errors.email.message)
						res.status(ERRORS.unauthorized.httpStatus).json(err.errors.email.message);
					if (err && err.errors && err.errors && err.errors.CPF && err.errors.CPF.message)
						res.status(ERRORS.unauthorized.httpStatus).json(err.errors.CPF.message);
					if (err && err.errors && err.errors && err.errors.marital_status && err.errors.marital_status.message)
						res.status(ERRORS.unauthorized.httpStatus).json(err.errors.marital_status.message + " The valid values are: 'single', 'married' or 'divorced'");
					if (err && err.errors && err.errors && err.errors.name && err.errors.name.message)
						res.status(ERRORS.unauthorized.httpStatus).json(err.errors.name.message);
					else
						res.status(ERRORS.unknown.httpStatus).json(_.extend({}, ERRORS.unauthorized, {
							original: err && err.stack || err
						}));
					console.error('[user post] error: ', err && err.stack || err);
				}
			}).done();
		});
	api.route('/:id')
		.get(function(req, res) {
			return userService.get(req.params.id).then(function(user) {
				res.json(user);
			}, function(err) {
				res.status(ERRORS.unknown.httpStatus).json(_.extend({}, ERRORS.unauthorized, {
					original: err && err.stack || err
				}));
				console.error('[user/:userId get] error: ', err && err.stack || err);
			});
		})
		.put(function(req, res) {
			var json = req.body;
			if (json.password)
				json.password = crypter.hash(req.body.password);
			return userService.update(req.params.id, json).then(function(user) {
				res.json(user);
			}, function(err) {
				if (err && err.code == 11000) {
					var value = err.err && err.err.match(/: "([^"]+)"/);
					res.status(ERRORS.duplicate_value.httpStatus).json(_.extend({}, ERRORS.duplicate_value, {
						value: value && value[1]
					}));
				} else {
					if (err && err.errors && err.errors && err.errors.email && err.errors.email.message)
						res.status(ERRORS.unauthorized.httpStatus).json(err.errors.email.message);
					if (err && err.errors && err.errors && err.errors.CPF && err.errors.CPF.message)
						res.status(ERRORS.unauthorized.httpStatus).json(err.errors.CPF.message);
					if (err && err.errors && err.errors && err.errors.marital_status && err.errors.marital_status.message)
						res.status(ERRORS.unauthorized.httpStatus).json(err.errors.marital_status.message + " The valid values are: 'single', 'married' or 'divorced'");
					else
						res.status(ERRORS.unknown.httpStatus).json(_.extend({}, ERRORS.unauthorized, {
							original: err && err.stack || err
						}));
					console.error('[user/:userId put] error: ', err && err.stack || err);
				}
			});
		})
		.delete(function(req, res) {
			return userService.delete(req.params.id).then(function() {
				res.status(204).json("User successfully deleted.");
			}, function(err) {
				res.status(ERRORS.unknown.httpStatus).json(_.extend({}, ERRORS.unauthorized, {
					original: err && err.stack || err
				}));
				console.error('[user/:userId delete] error: ', err && err.stack || err);
			});
		});

	return api;
}
