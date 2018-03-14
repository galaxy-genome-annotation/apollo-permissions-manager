/**
 * Services provided to the apolloPermissions application object
 * @param {object} apolloPermissions Base angular application object
 */
export default function(apolloPermissions) {
	apolloPermissions.service("$mdLoginToast", ['$mdToast',
		function($mdToast) {
			return {
				show: function(content) {
					return $mdToast.show(
						$mdToast.simple()
							.content(content)
							.position("top right")
							.hideDelay(2000)
					);
				},
			};
		}
	]);

	apolloPermissions.service("$mdNotifyToast", ['$mdToast',
		function($mdToast) {
			return {
				show: function(content) {
					return $mdToast.show(
						$mdToast.simple()
							.content(content)
							.position("top right")
					);
				},
			};
		}
	]);
}
