module.exports.timestamps = function( schema, options ) {
	schema.add({
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date
	});

	schema.pre( 'save', function ( next ) {
		if ( this.isNew ) {
			this.createdAt = new Date();
		}

		if ( this.isNew || this.isModified() )
			this.updatedAt = new Date();

		next();
	});
};

module.exports.eventsCreateUpdate = function( schema ) {
	schema.pre( 'save', function ( next ) {
		this._wasnew = this.isNew;
		next();
	});

	schema.post( 'save', function () {
		if ( this._wasnew ) this.emit( 'create', this );
		else this.emit( 'update', this );
	});
};
