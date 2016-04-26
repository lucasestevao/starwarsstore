var mongoose = require( 'mongoose' );
var plugins	 = require( '../utils/mongoose_plugins' );


var Schema	 = mongoose.Schema;

var AuthSchema = new Schema({
	user: {
		id: { type: String },
		name: {
			type: String,
			required: true,
			trim:true
		},
		email: {
			type: String,
			required: true,
			trim:true
		}
	}
});

AuthSchema.plugin( plugins.timestamps );

AuthSchema.set( 'toJSON', {
	virtuals: true,
	transform: function ( doc, ret, options ) {
		delete ret._id;
		delete ret.__v;
	}
});

module.exports = mongoose.model( 'Auth', AuthSchema );