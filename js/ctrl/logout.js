/**
 * Log Out Controller
 * @param {object} apolloPermissions Base angular application object
 */
export default function(apolloPermissions) {
	apolloPermissions.controller("LogOutCtrl", ["$scope", "$http", "$localStorage", "$location",
		function($scope, $http, $localStorage, $location) {
			$localStorage.apolloCredentials = {};
			$scope.nav.userData = {};
			$location.path("/");
		},
	]);
}
