'use strict';

angular.module('signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/signup', {
		templateUrl: 'signup.html',
		controller: 'LoginCtrl'
	});
}])
