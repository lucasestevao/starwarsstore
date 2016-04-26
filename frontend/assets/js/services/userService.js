angular.module('starwarsstore')
	.factory('UserService', ['$q', '$http', '$window', '$state', function($q, $http) {
		var baseEndpoint = '/api/v1/user';
		var canceler;

		function createUser(user) {
			return $http.post(baseEndpoint, user).then(function(res) {
				return res.data;
			}, function(res) {
				return $q.reject([res.data, res.status]);
			});
		}

		function get(id) {
			return $http.get(baseEndpoint + '/' + id).then(function(res) {
				return res.data;
			}, function(res) {
				return $q.reject([res.data, res.status]);
			});
		}

		function list(queryParams) {
			if (canceler) canceler.resolve();
			canceler = $q.defer();
			return $http.get(baseEndpoint, {
				params: queryParams
			}).then(function(res) {
				return res;
			}, function(res) {
				return $q.reject([res.data, res.status]);
			});
		}

		function put(id, user) {
			return $http.put(baseEndpoint + '/' + id, user).then(function(res) {
				return res.data;
			}, function(res) {
				return $q.reject([res.data, res.status]);
			});
		}

		function deleteUser(id) {
			return $http.delete(baseEndpoint + '/' + id).then(function(res) {
				return res.status;
			}, function(res) {
				return $q.reject([res.data, res.status]);
			});
		}

		return {
			createUser: createUser,
			get: get,
			list: list,
			put: put,
			deleteUser: deleteUser
		};
	}]);
