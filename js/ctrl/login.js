let jwt_decode = require("jwt-decode");

/**
 * Login Controller
 * @param {object} base Base angular application object
 */
export default function(base) {
	base.controller("LoginCtrl", ["$scope", "$http", "$localStorage", "$location", "$mdLoginToast", "DRF_URL",
		function($scope, $http, $localStorage, $location, $mdLoginToast, DRF_URL) {
			$scope.userData = {};

			$scope.saveData = function() {
				if ($scope.loginForm.$valid) {
					$localStorage.apolloCredentials = $scope.userData;
					// TODO: make test request.
					$mdLoginToast.show("Success");
					$location.path("/");
				}
				if ($scope.loginForm.$invalid) {
					console.log("invalid");
				}
			};
		}]);
}
