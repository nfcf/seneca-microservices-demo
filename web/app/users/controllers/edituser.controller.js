(function () {
    'use strict';

    angular
        .module('app.users.controllers')
        .controller('EditUserController', EditUserController);

    EditUserController.$inject = ['$scope', '$translate', '$mdDialog', 'Users', 'selectedItem', 'editProfileMode'];

    function EditUserController($scope, $translate, $mdDialog, Users, selectedItem, editProfileMode) {
        var vm = this;
        vm.cancel = $mdDialog.cancel;
        vm.save = save;

        vm.error = undefined;

        vm.dialogTitle = $translate.instant('EDIT_USER');
        vm.editProfileMode = editProfileMode;

        vm.roles = [
            { value: 'admin', desc: 'Administrator' },
            { value: 'user_manager', desc: 'User Manager' },
            { value: 'user', desc: 'User' }
        ];
        vm.user = selectedItem;
        
        function save() {
            vm.userForm.$setSubmitted();

            if (vm.userForm.$valid) {
                Users.update(vm.user).then(success, error);
            }
        };

        function success() {
            Users.setCookiesUserInfo(vm.user);
            $mdDialog.hide();
        }

        function error(response, status, headers, config) {
            vm.error = response.status != 500 ? JSON.stringify(response.data) : response.statusText;
        }
    }

})();