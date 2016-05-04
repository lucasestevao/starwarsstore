'use strict';

angular.module('bag', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/bag', {
		templateUrl: 'bag.html',
		controller: 'BagCtrl'
	});
}])

.controller('BagCtrl', ['$scope', '$http', function($scope, $http) {
	var config = {
		headers: {
			'Content-type': 'application/json; charset=utf8',
			'Accept': 'application/json',
			'X-Request': 'JSON',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type,X-Requested-With',
			'Access-Control-Allow-Methods': 'GET, POST'
		}
	};

	function init() {
		$http.get('api/shoppingcart/', config.headers).

		success(function(data) {
			$scope.shopData = data;
		}).

		error(function(data, status) {
			console.log(status);
		});
	};

	init();
}])
