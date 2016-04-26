var Q = require( 'q' );
var _ = require( 'underscore' );
var path 	= require( 'path' );
var config 	= require( '../config' );
var User 	= require( '../models/user' );
var Auth 	= require( '../models/auth' );
var ERRORS 	= require( '../utils/constants' ).ERRORS;
var crypter = require( '../utils/crypter' );

function createAuthFromUser( user ) {
	var p = JSON.parse( JSON.stringify( user ) );
	var auth = new Auth({
		user: p,
		lastLogin: new Date()
	});

	return Q.ninvoke( auth,'save' ).spread( _.identity );
}

function getUserByEmail( email ) {
	if( _.isEmpty( email ) )
		return Q.reject( ERRORS.unauthorized );

	return Q.ninvoke( User, 'findOne', {
		$or: [{email: email}, { 'responsible.email': email }],
		inactiveAt: null,
		deletedAt: null
	}).then( function( user ) {
		if( !user )
			return Q.reject( ERRORS.unauthorized );

		return user;
	});
}

module.exports.userLogin = function( email, password ){
	if( _.isEmpty( email ) || _.isEmpty( password ) )
		return Q.reject( ERRORS.unauthorized );

	return getUserByEmail( email ).then( function( user ){
		var pass = user.password;

		if( !crypter.validate( pass, password ) )
			return Q.reject( ERRORS.unauthorized );

		return user;
	}).then( function( user ){
		return createAuthFromUser( user );
	});
};

module.exports.get = function( authId ) {
	if( _.isEmpty( authId ) )
		return Q.reject( ERRORS.unauthorized );

	return Q.ninvoke( Auth, 'findOne', { _id:authId } ).then( function( auth ){
		if( !auth )
			return Q.reject( ERRORS.unauthorized );

		Auth.update({ _id: auth._id}, { lastLogin: new Date() });

		return auth;
	} );
};
