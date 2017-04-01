export default function(apolloPermissions) {
    apolloPermissions.controller("UserCtrl", ["$scope", "$location", "$http", "$localStorage", "$mdLoginToast",
        function($scope, $location, $http, $localStorage, $mdLoginToast) {
            $scope.dataLoadingGroup = $http({
                'url': $localStorage.apolloCredentials.apollo_url + "/group/loadGroups",
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
                    $scope.groups = data.map(function(group){
                        group.organismPermissions = group.organismPermissions.filter(function(p){
                            return p.id && p.permissions.length > 2;
                        }).map(function(p){
                            p.permissions = JSON.parse(p.permissions);
                            return p;
                        })
                        return group;
                    }).reduce(function(map, obj){
                        // Convert [{name: 1}, {name: 2}]  to {1: {name: 1}, 2: {name: 2}}
                        map[obj.name] = obj;
                        return map;
                    }, {});


                    $scope.dataLoading = $http({
                        'url': $localStorage.apolloCredentials.apollo_url + "/user/loadUsers",
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
                            $scope.users = data.map(function(user){
                                user.organismPermissions = user.organismPermissions.filter(function(orgPer){
                                    return orgPer.id && orgPer.permissions.length > 2;
                                }).map(function(orgPer){
                                    orgPer.permissions = JSON.parse(orgPer.permissions);
                                    return orgPer;
                                })
                                user.isAdmin = user.role === "ADMIN";

                                var tmp = user.organismPermissions.map(function(d){
                                    return {
                                        perm: d.permissions.sort().join(', '),
                                        via: 'direct',
                                        org: d.organism,
                                        id: d.id,
                                    };
                                });
                                user.groups.forEach(function(g){
                                    $scope.groups[g.name].organismPermissions.forEach(function(d){
                                        tmp.push({
                                            perm: d.permissions.sort().join(', '),
                                            via: 'Group ' + g.name,
                                            org: d.organism,
                                            id: d.id,
                                        });
                                    });
                                });

                                user.mergedPerms = tmp.reduce(function(a, b){
                                    var existingNames = a.map(function(q){ return q.id; });
                                    if (existingNames.indexOf(b.id) < 0 ){
                                        a.push(b);
                                    }
                                     return a;
                                },[]);

                                return user;
                            });
                        })
                        .error(function(err, error_code) {
                            $mdLoginToast.show('[' + error_code + '] ' + err);
                        });



                })
                .error(function(err, error_code) {
                    $mdLoginToast.show('[' + error_code + '] ' + err);
                });





        }]);
}
