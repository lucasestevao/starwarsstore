var Q = require( 'q' );
var _ = require( 'underscore' );

module.exports.listAndCount = function( Model, params, start, limit, sort, populates ) {
	var _query = _.extend( {
		deletedAt: null
	}, params );

	var opts = {
		sort: sort,
		skip: start,
		limit: limit
	};

	console.log( 'query before listAndCount: %j', _query );
	console.log( 'opts before listAndCount: %j', opts );

	var query = Model.find( _query, {}, opts );

	if ( populates ) {
		_.each( _.isArray( populates ) ? populates : [populates], function( p ) {
			query.populate( p );
		});
	}

	return Q.all( [
		Q.ninvoke( query, 'exec' ),
		Q.ninvoke( Model, 'count', _query )
	] );
};

module.exports.create = function( Model, json ) {
	// create a new instance of the Bear model
	var doc = new Model( json );

	// save the doc and check for errors
	return Q.ninvoke( doc, 'save' ).spread( function( doc ) {
		return doc;
	});
};

module.exports.update = function( doc, json ) {
	_.extend( doc, json );

	return Q.ninvoke( doc, 'save' ).spread( function( doc ) {
		return doc;
	});
};

module.exports.createOrUpdate = function( Model, queryParams, json, beforeCreateUpdate, includeDeleted ) {
	if ( !queryParams )
		return Q.reject( 'cant run without queryParams' );

	return _get( Model, queryParams, null, includeDeleted ).then( function( doc ) {
		if ( !doc ) {
			doc = new Model( json );
		} else {
			_.extend( doc, json );
		}

		// function to call before create or update
		if ( beforeCreateUpdate ) beforeCreateUpdate( doc );
		return Q.ninvoke( doc, 'save' ).spread( function( doc ) {
			return doc;
		});
	});
};

var _get = module.exports.get = function( Model, params, populates, includeDeleted ) {
	if ( !includeDeleted ) {
		params = _.extend( {
			deletedAt: null
		}, params );
	}

	var query = Model.findOne( params );

	if ( populates ) {
		_.each( _.isArray( populates ) ? populates : [populates], function( p ) {
			query.populate( p );
		});
	}

	return Q.ninvoke( query, 'exec' );
};

module.exports.delete = function( Model, params ) {
	if ( _.isEmpty( params ) )
		return Q.reject( 'will not delete without params' );

	return Q.ninvoke( Model, 'update', _.extend( {
		deletedAt: null
	}, params ), {
		deletedAt: new Date(  )
	});
};

module.exports.getAll = function( Model ) {
	return Q.ninvoke( Model, 'find', _.extend( {
		deletedAt: null
	}));
};
