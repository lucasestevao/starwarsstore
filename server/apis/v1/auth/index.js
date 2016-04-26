var express = require( 'express' );
var Q = require( 'q' );
var _ = require( 'underscore' );

var ERRORS = require( '../../../utils/constants' ).ERRORS;
var authService = require( '../../../services/authService' );

exports = module.exports = this_module;

function this_module( options ){
	var appApi = express.Router();

	appApi.post( '/login', function( req, res ) {
		var email = req.body.email,
			password = req.body.password;

		authService.clientLogin( email, password ).then( function( auth ) {
			res.json( auth );
		}, function( err ) {
			if( err.httpStatus == 202 || err.httpStatus == 401 ) {
				res.status( err.httpStatus ).json( err );
			} else {
				res.status( ( err && err.httpStatus ) || ERRORS.unknown.httpStatus ).json( err || ERRORS.unknown );
			}
		} );
	} );

	return appApi;
}
