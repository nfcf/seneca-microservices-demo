(function () {
  'use strict';

  // angular.
  //  bootstrap(document.body, ['app']);

  var app = angular
    .module('app', [
      'ngAnimate',
      'ngAria',
      'ngCookies',
      'ngMessages',
      'ngMaterial',
      'ngSanitize',
      'pascalprecht.translate', // translateProvider
      'md.data.table',
      'mdPickers',

      'app.config',
      'app.filters',
      'app.routes',
      'app.authentication',
      'app.navbar',
      'app.runs',
      'app.users'
    ]);

  angular
    .module('app.config', []);

  angular
    .module('app.filters', []);

  angular
    .module('app.routes', ['ngRoute']);

  app.
  value('apiBaseURL', 'http://localhost:3333');

  angular
    .module('app')
    .run(run);

  run.$inject = ['$http'];

  function run($http) {}
})();
