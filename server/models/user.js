var mongoose = require( 'mongoose' );
var plugins	 = require( '../utils/mongoose_plugins' );
var helpers	 = require( '../utils/helpers' );

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	}
});

UserSchema.plugin( plugins.timestamps );

UserSchema.path( 'email' ).validate( function( value ) {
	return helpers.verifyEmail( value );
}, 'Invalid email' );

UserSchema.set( 'toJSON', {
	virtuals: true,
	transform: function( doc, ret, options ) {
		delete ret._id;
		delete ret.__v;
		delete ret.password;
	}
});

var User = module.exports = mongoose.model( 'User', UserSchema );
