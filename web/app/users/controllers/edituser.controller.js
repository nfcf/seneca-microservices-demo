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
      { value: 'Administrator', desc: 'Administrator' },
      { value: 'User Manager', desc: 'User Manager' },
      { value: 'User', desc: 'User' }
    ];
    vm.user = selectedItem;
    vm.user.role = getUserRoleFromProperties();

    function save() {
      vm.userForm.$setSubmitted();

      if (vm.userForm.$valid) {
        vm.user.admin = vm.user.role === 'Administrator';
        vm.user.manager = vm.user.role === 'User Manager';
        vm.user.role = undefined;

        Users.update(vm.user).then(success, error);
      }
    };

    function success() {
      Users.setCookiesUserInfo(vm.user);
      $mdDialog.hide();
    }

    function error(response, status, headers, config) {
      vm.user.role = getUserRoleFromProperties();
      vm.error = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
    }

    function getUserRoleFromProperties() {
      return vm.user.admin ? 'Administrator'
             : vm.user.manager ? 'User Manager' : 'User';
    }
  }
})();
