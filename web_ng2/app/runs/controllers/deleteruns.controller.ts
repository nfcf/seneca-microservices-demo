(function () {
  'use strict';

  angular
    .module('app.runs.controllers')
    .controller('DeleteRunsController', DeleteRunsController);

  DeleteRunsController.$inject = ['$scope', '$location', '$mdDialog', 'Runs', 'selectedItems'];

  function DeleteRunsController($scope, $location, $mdDialog, Runs, selectedItems) {
    var vm = this;
    vm.cancel = $mdDialog.cancel;
    vm.destroy = destroy;

    vm.error = undefined;

    function destroy() {
      if (selectedItems.length > 0) {
        var toDelete = selectedItems[0];
        selectedItems.splice(0, 1);
        Runs.destroy(toDelete).then(destroy, error);
      }
      else {
        $mdDialog.hide();
      }
    };

    function error(response, status, headers, config) {
      vm.error = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
    }
  }
})();
