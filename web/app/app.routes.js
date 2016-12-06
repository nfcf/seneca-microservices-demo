(function () {
  'use strict';

  angular
    .module('app.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider.when('/login', {
      pageTitle: 'LOGIN',
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/templates/authentication/login.html'
    }).when('/runs', {
      pageTitle: 'RUNS',
      controller: 'RunsController',
      controllerAs: 'vm',
      templateUrl: '/templates/runs/runs.html'
    }).when('/users', {
      pageTitle: 'USERS',
      controller: 'UsersController',
      controllerAs: 'vm',
      templateUrl: '/templates/users/users.html'
    }).otherwise({
      redirectTo: '/login'
    });
  }
})();
