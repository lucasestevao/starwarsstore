$(document).foundation();

'use strict';

angular.module('starwarsstore', [
	'ngRoute',
	'bag',
	'product',
	'login',
	'signup'
])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
		var _getAuth = ['AuthService', '$state', '$rootScope', function(AuthService, $state, $rootScope) {
			return AuthService.me().then(function(auth) {
				$rootScope.auth = auth;
				return auth;
			}, function() {
				delete $rootScope.auth;
				$state.go('login');
			});
		}];


		$stateProvider.state('login', {
				url: '/login',
				templateUrl: '../../views/login.html',
				controller: 'LoginCtrl'
			})
			.state('signup', {
				url: '/signup',
				templateUrl: '../../views/signup.html',
				controller: 'SignupCtrl'
			});

		// HTML5 History API
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		$urlRouterProvider.otherwise('/login');
	}
])

.run(['$rootScope', '$q', 'AuthService', '$state', '$window', '$location', '$route',
	function($rootScope, $q, AuthService, $state, $window, $location, $route) {
		$q.resolve = function(val) {
			var d = $q.defer();
			d.resolve(val);
			return d.promise;
		};

		var original = $location.path;
		$location.path = function(path, reload) {
			if (reload === false) {
				var lastRoute = $route.current;
				var un = $rootScope.$on('$locationChangeSuccess', function() {
					$route.current = lastRoute;
					un();
				});
			}
			return original.apply($location, [path]);
		};

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			$window.scrollTo(0, 0);
			$rootScope.lastState = fromState;
			$rootScope.lastStateParams = fromParams;

			if (!AuthService.exists && toState.name.indexOf('login') == -1)
				$state.go('login');
		});

		$rootScope.logout = function() {
			AuthService.logout();
			delete $rootScope.auth;
			$window.location.host = $window.location.host;
		};

	}
]);
