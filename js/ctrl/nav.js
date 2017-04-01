/**
 * Nav menu controller
 * @param {object} apolloPermissions Base angular application object
 */
export default function(apolloPermissions) {
	apolloPermissions.controller("NavCtrl", ["$scope", "$mdSidenav", "$localStorage", "$location", "$interval",
		function($scope, $mdSidenav, $localStorage, $location, $interval) {
			$scope.nav = {};
			$scope.nav.userData = $localStorage.apolloCredentials;

			$scope.$on("$locationChangeStart", function(event) {
				if ($location.path() == "/login") {
					$scope.nav.show_login_button = false;
				} else {
					$scope.nav.show_login_button = true;
				}
			});

			$scope.go = function(route) {
				$location.path(route);
			};

		}]);
}
