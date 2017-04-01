export default function(apolloPermissions) {
    apolloPermissions.controller("OrgCtrl", ["$scope", "$location", "$http", "$localStorage", "$mdLoginToast",
        function($scope, $location, $http, $localStorage, $mdLoginToast) {
            $scope.myOrder3 = 'commonName';
            $scope.dataLoadingOrg = $http({
                'url': $localStorage.apolloCredentials.apollo_url + "/organism/findAllOrganisms",
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                },
                'data': {
                    'username': $localStorage.apolloCredentials.username,
                    'password': $localStorage.apolloCredentials.password,
                }
            })
                .success(function(data) {
                    $scope.organisms = data;
                })
                .error(function(err, error_code) {
                    $mdLoginToast.show('[' + error_code + '] ' + err);
                });
        }]);
}
