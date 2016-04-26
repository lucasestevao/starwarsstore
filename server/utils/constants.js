var constants = {
	ERRORS: {
		unknown: {
			code: 1,
			httpStatus: 500,
			desc: 'Server Error'
		},
		unauthorized: {
			code: 2,
			httpStatus: 403,
			desc: 'Unauthorized'
		},
		duplicate_value: {
			code: 3,
			httpStatus: 401,
			desc: 'Duplicated Value'
		}
	}
};

if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = constants;
}
