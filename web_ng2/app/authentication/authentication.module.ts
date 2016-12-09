(function () {
  'use strict';

  angular
    .module('app.authentication', [
      'app.authentication.controllers',
      'app.authentication.services'
    ]);

  angular
    .module('app.authentication.controllers', []);

  angular
    .module('app.authentication.services', ['ngCookies']);
})();
