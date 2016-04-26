'use strict';

angular.module('login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl: 'login.html',
		controller: 'LoginCtrl'
	});
}])

.controller('LoginCtrl', ['$scope', function($scope) {

}]);
