$(document).foundation();

'use strict';

angular.module('starwarsstore', [
	'ngRoute',
	'bag',
	'product',
	'login',
	'signup'
])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo: '/login'
	});
}]);
