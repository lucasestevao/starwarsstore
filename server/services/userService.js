var User 		= require( '../models/user' );
var baseService = require( './baseService' );

module.exports.create = function( json ) {
	return baseService.create( User, json ).then( function( user ) {
		return user;
	});
};

module.exports.get = function( id, populates ) {
	return baseService.get( User, {
		_id: id
	}, populates ).then( function( user ) {
		return user;
	});
};

module.exports.listAndCount = function( params, start, limit, sort, populates ) {
	return baseService.listAndCount( User, params, start, limit, sort, populates );
};

module.exports.update = function( id, json ) {
	return baseService.createOrUpdate( User, {
		_id: id
	}, json ).then( function( user ) {
		return user;
	});
};

module.exports.delete = function( id ) {
	return baseService.delete( User, {
		_id: id
	});
};
