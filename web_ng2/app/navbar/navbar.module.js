(function () {
    'use strict';
    angular
        .module('app.navbar', [
        'app.navbar.controllers',
        'app.navbar.services'
    ]);
    angular
        .module('app.navbar.controllers', []);
    angular
        .module('app.navbar.services', ['ngCookies']);
    angular.module('app.navbar')
        .directive('navBar', function () {
        return {
            retrict: 'AE',
            scope: {},
            templateUrl: '/templates/navbar/navbar.html',
            controller: 'NavBarController',
            controllerAs: 'vm'
        };
    });
})();
//# sourceMappingURL=navbar.module.js.map