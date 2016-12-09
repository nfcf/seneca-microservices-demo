(function () {
    'use strict';
    angular
        .module('app.runs.controllers')
        .controller('EditRunController', EditRunController);
    EditRunController.$inject = ['$scope', '$translate', '$mdDialog', 'Runs', 'selectedItem'];
    function EditRunController($scope, $translate, $mdDialog, Runs, selectedItem) {
        var vm = this;
        vm.cancel = $mdDialog.cancel;
        vm.save = save;
        vm.error = undefined;
        vm.isNew = (!!selectedItem == false);
        vm.dialogTitle = $translate.instant(vm.isNew ? 'ADD_RUN' : 'EDIT_RUN');
        if (vm.isNew) {
            vm.run = {
                distance: 10.0,
                occurredAt: new Date()
            }; // Defaults
        }
        else {
            vm.run = selectedItem;
            vm.run.occurredAt = new Date(vm.run.occurredAt);
        }
        function save() {
            vm.runForm.$setSubmitted();
            if (vm.runForm.$valid) {
                if (vm.isNew) {
                    Runs.create(vm.run).then(success, error);
                }
                else {
                    Runs.update(vm.run).then(success, error);
                }
            }
        }
        ;
        function success(data) {
            $mdDialog.hide();
        }
        function error(response, status, headers, config) {
            vm.error = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
        }
    }
})();
//# sourceMappingURL=editrun.controller.js.map