(function () {
  'use strict';

  angular
    .module('app.runs.controllers')
    .controller('RunsController', RunsController);

  RunsController.$inject = ['$scope', '$location', '$mdDialog', '$translate', 'Authentication', 'Users', 'Runs'];

  function RunsController($scope, $location, $mdDialog, $translate, Authentication, Users, Runs) {
    var vm = this;
    vm.refresh = refresh;
    vm.editUserSettings = editUserSettings;
    vm.editItem = editItem;
    vm.deleteItems = deleteItems;

    vm.error = undefined;
    vm.refreshPromise = undefined;

    vm.welcome = {
      title: undefined,
      text: undefined,
      mood: undefined
    }

    vm.currentWeeklyDistance = undefined;
    vm.targetWeeklyDistance = undefined;
    vm.showUserColumn = false;

    vm.runs = [];
    vm.selectedItems = [];

    vm.options = {
      rowSelection: true,
      multiSelect: true,
      autoSelect: true,
      decapitate: false,
      boundaryLinks: false,
      limitSelect: undefined, // or array like: [10, 25, 50]
      pageSelect: true
    };

    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    var endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 59);
    vm.query = {
      filter: {
        startDate: startOfToday,
        startTime: startOfToday,
        endDate: endOfToday,
        endTime: endOfToday
      },
      order: {
        occurredAt: -1
      },
      limit: 10,
      page: 1
    };

    activate();

    function activate() {
      angular.forEach(['AUTH_TOKEN_UPDATED', 'LANGUAGE_UPDATED'], function (ev) {
        $scope.$on(ev, function () {
          updateControls();
        });
      });

      $scope.$watchGroup(['vm.query.filter.startDate',
        'vm.query.filter.startTime',
        'vm.query.filter.endDate',
        'vm.query.filter.endTime'
      ], function (newValue, oldValue) {
        vm.refresh();
      });

      updateControls();
      refresh();
    }

    function updateControls() {
      var userInfo = Authentication.getCookiesAuthToken();
      if (!!userInfo) {
        setWelcomeMessages(vm.currentWeeklyDistance);

        vm.showUserColumn = userInfo.user.admin === true;
      }
    }

    function refresh() {
      vm.selectedItems = [];

      vm.refreshPromise = Runs.list(vm.query).then(listSuccessFn, errorFn);

      Runs.getStats().then(statsSuccessFn, errorFn);

      function listSuccessFn(data, status, headers, config) {
        vm.error = undefined;
        vm.runs = data.data;
      }

      function statsSuccessFn(data, status, headers, config) {
        vm.currentWeeklyDistance = data.data.weekly_distance;

        setWelcomeMessages(vm.currentWeeklyDistance);
      }

      function errorFn(data, status, headers, config) {
        vm.error = data.status !== 500 ? JSON.stringify(data.data) : data.statusText;
      }
    }

    function setWelcomeMessages(currentWeeklyDistance) {
      var userInfo = Authentication.getCookiesAuthToken();
      if (userInfo != null) {
        var targetWeeklyDistance = userInfo.user.targetWeeklyDistance;

        vm.welcome.title = $translate.instant('WELCOME_USER', {
          user: (userInfo.user.name || userInfo.user.email)
        });
        vm.welcome.text = $translate.instant('WELCOME_STATS', {
          currentWeeklyDistance: currentWeeklyDistance,
          targetWeeklyDistance: targetWeeklyDistance
        });
        vm.welcome.mood = currentWeeklyDistance < targetWeeklyDistance ? 'bad' : 'good';
      }
    }

    function editUserSettings(event) {
      $mdDialog.show({
        clickOutsideToClose: true,
        controller: 'EditUserController',
        controllerAs: 'vm',
        focusOnOpen: true,
        targetEvent: event,
        templateUrl: 'templates/users/edit-user-dialog.html',
        locals: {
          selectedItem: Authentication.getCookiesAuthToken().user,
          editProfileMode: true
        }
      }).then(vm.refresh);
    }

    function editItem(event, run) {
      event.stopPropagation();

      $mdDialog.show({
        clickOutsideToClose: true,
        controller: 'EditRunController',
        controllerAs: 'vm',
        focusOnOpen: true,
        targetEvent: event,
        templateUrl: 'templates/runs/edit-run-dialog.html',
        locals: {
          selectedItem: JSON.parse(JSON.stringify(run)) // Passes a copy of the object
        }
      }).then(vm.refresh);
    }

    function deleteItems(event) {
      $mdDialog.show({
        clickOutsideToClose: true,
        controller: 'DeleteRunsController',
        controllerAs: 'vm',
        focusOnOpen: true,
        targetEvent: event,
        templateUrl: 'templates/runs/delete-runs-dialog.html',
        locals: {
          selectedItems: vm.selectedItems
        }
      }).then(vm.refresh);
    }
  }
})();
