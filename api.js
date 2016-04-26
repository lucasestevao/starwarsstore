var _ 	 = require( 'underscore' );
var path = require( 'path' );
var corser	= require( 'corser' );
var express = require( 'express' );
var mongoose = require( 'mongoose' );
var bodyParser 	= require( 'body-parser' );
var expressHbs 	= require( 'express-handlebars' );
var cacheResponse = require( 'express-cache-response-directive' );
var legacyExpires = require( 'express-legacy-expires' );

var appConfig 	= require( './server/config' );
var appApi = require( './server/apis/v1' );
var expressAngularRoutes = require( './server/express-angular-routes' );

var app	 = express();
var rootPath = path.normalize( __dirname + '' );
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3002;
var uri = appConfig.get( 'db:uri' );

// Configure Express4
app.engine( 'html', expressHbs({
	extname: 'html'
}));

app.set( 'view engine', 'html' );

app.use( bodyParser.urlencoded({
	extended: true
}));

app.use( bodyParser.json() );

app.use( corser.create({
	methods: corser.simpleMethods.concat( ['PUT', 'DELETE'] ),
	requestHeaders: corser.simpleRequestHeaders.concat( ['Authorization', 'X-List-Total'] )
}));

app.use( legacyExpires() );
app.use( cacheResponse() );

app.use( function noCache( req, res, next ) {
	res.cacheControl( "private" );
	res.cacheControl({
		maxAge: 0
	});
	next();
});

// Views and statics
app.set( 'views', rootPath + '/frontend/public' );
app.use( express.static( path.join( rootPath, 'frontend/public' ) ) );

if (!_.isEmpty( uri )) {
	console.log( 'Connecting to mongo uri: ' + uri );
	var connection = mongoose.connect( uri );
} else {
	console.error( '[ERROR] Mongo uri is empty.' );
}

app.use( '/api/v1', appApi() );
app.use( '/', expressAngularRoutes() );

if ( !process.env.DONT_START_SERVER ) {
	app.listen( port, function() {
		console.log( 'Star Wars Store working on port ' + port );
	});
}

process.on( 'uncaughtException', function( err ) {
	console.log( '[ERROR] Uncaught Exception: ' + err );
});

module.exports.dbinfo = { mongoose: mongoose };
module.exports.app = app;
module.exports.port = port;
