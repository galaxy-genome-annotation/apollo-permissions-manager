export default function(apolloPermissions) {
    apolloPermissions.controller("GroupCtrl", ["$scope", "$location", "$http", "$localStorage", "$mdLoginToast", "$mdDialog",
        function($scope, $location, $http, $localStorage, $mdLoginToast, $mdDialog) {
            // Utility Function
            var makePost = function(path, data){
                if(data === undefined){ data = {}; }
                data.username = $localStorage.apolloCredentials.username;
                data.password = $localStorage.apolloCredentials.password;

                return $http({
                    'url': $localStorage.apolloCredentials.apollo_url + path,
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json',
                    },
                    'data': data
                });
            }



            $scope.dataLoadingGroup = makePost("/group/loadGroups", {
            }).success(function(data) {
                $mdLoginToast.show('Groups Loaded');
                $scope.groups = data.map(function(group){
                    group.organismPermissions = group.organismPermissions.filter(function(p){
                        return p.id && p.permissions.length > 2;
                    }).map(function(p){
                        p.permissions = JSON.parse(p.permissions);

                        p.p = {
                            ADMINISTRATE: p.permissions.indexOf('ADMINISTRATE') != -1,
                            READ: p.permissions.indexOf('READ') != -1,
                            WRITE: p.permissions.indexOf('WRITE') != -1,
                            EXPORT: p.permissions.indexOf('EXPORT') != -1,
                        }
                        return p;
                    })
                    return group;
                });

                $scope.dataLoading = makePost("/user/loadUsers")
                .success(function(data) {
                    $mdLoginToast.show('Users Loaded');
                    $scope.users = data.map(function(u){
                        u._prefmt = u.firstName + " " + u.lastName + " <" + u.username + ">";
                        u._lowername = angular.lowercase(u._prefmt);

                        u.organismPermissions = u.organismPermissions.filter(function(orgPer){
                            return orgPer.id && orgPer.permissions.length > 2;
                        })
                        return u;
                    });

                $scope.dataLoadingOrg = makePost("/organism/findAllOrganisms", {
                }).success(function(orgs){
                    $mdLoginToast.show('Orgs Loaded');
					console.log(orgs);
                    $scope.orgs = orgs.map(function(o){
                        o.name = o.genus + " " + o.species + " " + o.commonName;
                        o._lowername = angular.lowercase(o.name);
                        return o;
                    });







                    $scope.createForm = {
                        action: 'Create a Group',
                        cta: 'Create Group',
                        users: [],
                        func: $scope.confirmCreateGroup,
                        orgPerms: [],
                    };
                    // REAL STUFF GOES HERE.

                    function querySearch(criteria) {
                        cachedQuery = cachedQuery || criteria;
                        return cachedQuery ? $scope.users.filter(createFilterFor(cachedQuery)) : [];
                    }

                    function querySearchOrg(criteria) {
                        cachedQuery = cachedQuery || criteria;
                        return cachedQuery ? $scope.orgs.filter(createFilterForOrg(cachedQuery)) : [];
                    }

                    function createFilterFor(query) {
                        var lowercaseQuery = angular.lowercase(query);
                        return function filterFn(contact) {
                            if($scope.createForm.users.indexOf(contact) > -1){
                                return false;
                            }
                            return (contact._lowername.indexOf(lowercaseQuery) != -1);
                        };
                    }

                    function createFilterForOrg(query) {
                        var lowercaseQuery = angular.lowercase(query);
                        return function filterFn(org) {
                            var currentOrgNames = $scope.createForm.orgPerms.map(function(o){ return o.organism });
                            console.log(currentOrgNames)
                            if(currentOrgNames.indexOf(org.commonName) > -1){
                                return false;
                            }
                            return (org._lowername.indexOf(lowercaseQuery) != -1);
                        };
                    }

                    $scope.querySearch = function(criteria) {
                        return criteria ? $scope.users.filter(createFilterFor(criteria)) : [];
                    }

                    $scope.confirmCreateGroup = function(){
                        makePost("/group/createGroup", {
                            'name': $scope.createForm.group_name
                        }).success(function(groupResponse) {
                            makePost("/group/updateMembership", {
                                'groupId': groupResponse.id,
                                'users': $scope.createForm.users.map(function(u){
                                    return u.username;
                                })
                            }).success(function(data) {
                                console.log(data);
                                $mdLoginToast.show('Success!');
                            }).error(function(err, error_code) {
                                $mdLoginToast.show('[' + error_code + '] ' + err);
                            });
                        }).error(function(err, error_code) {
                            $mdLoginToast.show('[' + error_code + '] ' + err);
                        });


                        $mdDialog.cancel();
                    }

                    $scope.confirmUpdateGroup = function(){
                        makePost("/group/updateMembership", {
                            'groupId': $scope.createForm.group_id,
                            'users': $scope.createForm.users.map(function(u){
                                return u.username;
                            })
                        }).success(function(){
                            $mdLoginToast.show('Updated Membership');
                            $scope.createForm.orgPerms.forEach(function(orgPerm){
                                console.log(orgPerm);
                                var tmpOrgData = {
                                    'groupId': $scope.createForm.group_id,
                                    'organism': orgPerm.organism,

                                    'ADMINISTRATE': orgPerm.p.ADMINISTRATE,
                                    'READ': orgPerm.p.READ,
                                    'WRITE': orgPerm.p.WRITE,
                                    'EXPORT': orgPerm.p.EXPORT,
                                };
                                console.log(tmpOrgData);

                                makePost("/group/updateOrganismPermission", tmpOrgData).success(function(){
                                    $mdLoginToast.show('Updated Permissions for ' + orgPerm.organism);
                                }).error(function(err, error_code) {
                                    $mdLoginToast.show('[' + error_code + ':' + orgPerm.organism + '] ' + err);
                                });
                            });

                            $mdLoginToast.show('Updated Permissions');
                        }).error(function(err, error_code) {
                            $mdLoginToast.show('[' + error_code + '] ' + err);
                        });

                        $mdDialog.cancel();
                    }

                    $scope.create_popup = function(ev) {
                        $scope.createForm = {
                            action: 'Create a Group',
                            cta: 'Create Group',
                            users: [],
                            func: $scope.confirmCreateGroup,
                            orgPerms: [],
                        };

                        $mdDialog.show({
                            contentElement: '#createGroup',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true
                        });
                    };

                    $scope.editGroup = function(group){
                        $scope.createForm = {
                            action: 'Update ' + group.name,
                            cta: 'Update Group',
                            // Users of currently selected group
                            users: group.users.map(function(u){
                                u.username = u.email;
                                u._prefmt = u.firstName + " " + u.lastName + " <" + u.username + ">";
                                u._lowername = angular.lowercase(u._prefmt);
                                return u;
                            }),
                            orgPerms: group.organismPermissions,
                            group_name: group.name,
                            group_id: group.id,
                            func: $scope.confirmUpdateGroup,
                        };
                        console.log($scope.createForm);
                        $mdDialog.show({
                            contentElement: '#createGroup',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true
                        });
                    }

                    $scope.removeGroup = function(g){
                        var confirm = $mdDialog.confirm()
                              .title('Are you sure you want to delete ' + g.name)
                              .textContent('This is permanent.')
                              .ariaLabel('Remove Group Confirmation Dialog')
                              .ok('Remove the Group')
                              .cancel('Cancel');

                        $mdDialog.show(confirm).then(function() {
                            // Delete the group
                            makePost('/group/deleteGroup', {
                                'id': g.id,
                            }).success(function(data){
                                $mdLoginToast.show('Removed ' + g.name);
                                // Optimistically remove from list.

                                $scope.groups = $scope.groups.filter(function(g2){
                                    return g2.id != g.id;
                                });


                            }).error(function(err, error_code) {
                                $mdLoginToast.show('[' + error_code + '] ' + err);
                            });
                        }, function() {
                            // Do Nothing.
                        });


                    }

                    $scope.cancel = function(){
                        $mdDialog.cancel();
                    };

                    $scope.searchTextOrg = "";
                    $scope.selectedItemOrg = null;

                    $scope.querySearchOrg = function(queryString){
                        return queryString ? $scope.orgs.filter(createFilterForOrg(queryString)) : [];
                    }

                    $scope.createFormRemoveActiveOrg = function(o) {
                        $scope.createForm.orgPerms = $scope.createForm.orgPerms.filter(function(e){
                            return o.id != e.id;
                        });
                    };

                    $scope.selectedItemChange = function(item){
                        if(!item){ return; }

                        $scope.searchTextOrg = "";
                        $scope.selectedItemOrg = null;
                        $scope.createForm.orgPerms.push({
                            "organism": item.commonName,
                            'permissions': ['Stale Data'],
                            'groupId': null,
                            'id': item.id,
                            'p': {
                                'ADMINISTRATE': false,
                                'READ': true,
                                'WRITE': false,
                                'EXPORT': false,
                            }
                        });


                    };





                }).error(function(err, error_code) {
                    $mdLoginToast.show('[' + error_code + '] ' + err);
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
