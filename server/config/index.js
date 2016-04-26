'use strict';

console.log( 'Configuring the api...' );

var nconf = require( 'nconf' );

nconf.file( 'global', { file: __dirname + '/config.json' } );
nconf.load();

module.exports = nconf;
