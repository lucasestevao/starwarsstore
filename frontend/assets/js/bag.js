'use strict';

angular.module('bag', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('bag/', {
		templateUrl: 'bag.html',
		controller: 'BagCtrl'
	});
}])

.controller('BagCtrl', ['$scope', 'CommonProp', function($scope, CommonProp) {

}])

.service('CommonProp', function() {
	var Items = '';
	var Total = 0;

	return {
		getItems: function() {
			return Items;
		},
		setItem: function(value) {
			Items = value;
		},
		getTotal: function() {
			return Total;
		},
		setTotal: function(value) {
			Total = value;
		}
	};
});
