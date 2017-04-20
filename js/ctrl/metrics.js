export default function(apolloPermissions) {
    apolloPermissions.controller("MetricsCtrl", ["$scope", "$location", "$http", "$localStorage", "$mdLoginToast",
        function($scope, $location, $http, $localStorage, $mdLoginToast) {
			$scope.promise = $http({
				'url': $localStorage.apolloCredentials.apollo_url + "/metrics/metrics",
				'method': 'GET',
				'headers': {
					'Content-Type': 'application/json',
				},
			})
				.success(function(data) {
					$scope.data = data;
				})
				.error(function(err, error_code) {
					$mdLoginToast.show('[' + error_code + '] ' + err);
				});
        }]);
}
