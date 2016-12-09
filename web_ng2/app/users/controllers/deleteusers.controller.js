(function () {
    'use strict';
    angular
        .module('app.users.controllers')
        .controller('DeleteUsersController', DeleteUsersController);
    DeleteUsersController.$inject = ['$scope', '$location', '$mdDialog', 'Users', 'selectedItems'];
    function DeleteUsersController($scope, $location, $mdDialog, Users, selectedItems) {
        var vm = this;
        vm.cancel = $mdDialog.cancel;
        vm.destroy = destroy;
        vm.error = undefined;
        function destroy() {
            if (selectedItems.length > 0) {
                var toDelete = selectedItems[0];
                selectedItems.splice(0, 1);
                Users.destroy(toDelete).then(destroy, error);
            }
            else {
                $mdDialog.hide();
            }
        }
        ;
        function error(response, status, headers, config) {
            vm.error = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
        }
    }
})();
//# sourceMappingURL=deleteusers.controller.js.map