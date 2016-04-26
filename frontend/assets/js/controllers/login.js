'use strict';

angular.module('login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl: 'login.html',
		controller: 'LoginCtrl'
	});
}])

.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$window', 'AuthService', 'UserService',
	function($scope, $rootScope, $state, $stateParams, $window, AuthService, UserService) {
		$scope.user = {};
		$scope.alert = false;
		$scope.saving = false;

		function _getUser(user_id) {
			UserService.get(user_id).then(function(user) {
				$scope.user = user;
			}, function() {});
		}

		function _showMessage(text, type) {
			$scope.alert = {
				prefix: 'Ops!',
				text: text,
				type: type
			};
		}

		function _alert(text) {
			_showMessage(text, 'alert alert-danger');

			$('body, html').animate({
				scrollTop: 0
			}, 'normal');
		}

		$scope.main = function() {
			AuthService.me().then(function(auth) {
				if (!_.isEmpty(auth)) {
					$scope.auth = auth || false;

					if ($scope.auth) {
						_getUser($scope.auth.user.id);
					}
				}
			});
		};

		$scope.login = function(user) {
			delete $scope.alert;

			if (!user || !user.email || !user.password) {
				_alert('Please, fill all the fields.');
			} else {
				delete $scope.alert;
				$scope.loading = true;

				AuthService.login(user.email, user.password)
					.then(function(auth) {
						$state.go('userlist');
					}, function(res) {
						if (res && res[0] && res[0].code === 2) {
							_alert('This user is not valid.');
						} else {
							_alert('Sorry, please try again.');
						}

						$scope.loading = false;
					});
			}
		};

		$scope.signup = function() {
			UserService.createUser($scope.user)
				.then(function(res) {
					_showMessage($scope.user.name + ' was successfully recorded!', 'alert alert-success');
					$scope.saving = false;
				})
				.catch(function(err) {
					$scope.saving = false;

					if (err[0].httpStatus === 401) {
						_alert('This email already exists. Please, try another.');
					} else if (err[1] === 403) {
						_alert('Invalid email. Please, type the correct email.');
					} else {
						_alert('It wasn\'t possible save data. Please, try again later.');
					}
				});
		};
	}
]);
