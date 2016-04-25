$(document).foundation();

'use strict';

angular.module('starwarsstore', [
	'ngRoute',
	'bag',
	'product'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo: '/product'
	});
}]);
