(function () {
    'use strict';

    angular
        .module('app.users.controllers')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$scope', '$location', '$mdDialog', '$translate', 'Authentication', 'Users'];

    function UsersController($scope, $location, $mdDialog, $translate, Authentication, Users) {
        var vm = this;
        vm.refresh = refresh;
        vm.clearFilter = clearFilter;
        vm.editItem = editItem;
        vm.deleteItems = deleteItems;

        vm.error = undefined;
        vm.refreshPromise = undefined;

        vm.users = [];
        vm.selectedUsers = [];
        vm.bookmark = undefined;

        vm.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: true,
            decapitate: false,
            boundaryLinks: false,
            limitSelect: undefined,  // or array like: [10, 25, 50]
            pageSelect: true
        };

        vm.filterOptions = {
            debounce: 500
        };

        vm.query = {
            filter: '',
            sort: '-email',
            limit: 10,
            page: 1
        };

        activate();

        function activate() {
            $scope.$watch('vm.query.filter', function (newValue, oldValue) {
                if (!oldValue) {
                    vm.bookmark = vm.query.page;
                }

                if (newValue !== oldValue) {
                    vm.query.page = 1;
                }

                if (!!oldValue && !newValue) {
                    vm.query.page = vm.bookmark;
                }

                vm.refresh();
            });

            refresh();
        }

        function refresh() {
            vm.selectedUsers = [];

            vm.refreshPromise = Users.list(vm.query).then(successFn, errorFn);

            function successFn(data, status, headers, config) {
                vm.error = undefined;
                vm.users = data.data;
            }

            function errorFn(data, status, headers, config) {
                vm.error = data.status != 500 ? JSON.stringify(data.data) : data.statusText;
            }
        }

        function clearFilter() {
            vm.query.filter = '';

            if (vm.filterForm.$dirty) {
                vm.filterForm.$setPristine();
            }
        };

        function editItem(event, item) {
            event.stopPropagation();

            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'EditUserController',
                controllerAs: 'vm',
                focusOnOpen: true,
                targetEvent: event,
                templateUrl: 'templates/users/edit-user-dialog.html',
                locals: {
                    selectedItem: JSON.parse(JSON.stringify(item)),  // Passes a copy of the object
                    editProfileMode: false
                }
            }).then(vm.refresh);
        }

        function deleteItems() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'DeleteUsersController',
                controllerAs: 'vm',
                focusOnOpen: true,
                targetEvent: event,
                templateUrl: 'templates/users/delete-users-dialog.html',
                locals: {
                    selectedItems: vm.selectedUsers
                }
            }).then(vm.refresh);
        }
    }
})();