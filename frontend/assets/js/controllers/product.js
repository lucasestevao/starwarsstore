'use strict';

angular.module('product', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/product', {
		templateUrl: 'product.html',
		controller: 'ProductCtrl'
	});
}])

.controller('ProductCtrl', ['$scope', function($scope) {
	$scope.shopData = [{
		'name': 'C3PO dictionary',
		'id': 'prod-c3po',
		'price': '100',
		img: 'C3PO-dictionary.png'
	}, {
		'name': 'Storm Blast',
		'id': 'prod-storm',
		'price': '200',
		img: 'storm-tropper-blast.png'
	}, {
		'name': 'Darth Vader light saber',
		'id': 'prod-darth',
		'price': '400',
		img: 'darth-vader-light-saber.png'
	}, {
		'name': 'Boba Fett hunter manual',
		'id': 'prod-boba',
		'price': '300',
		img: 'boba-fett-hunter-manual.png'
	}];
}]);
