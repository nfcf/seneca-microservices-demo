(function () {
    'use strict';
    angular
        .module('app.navbar.controllers')
        .controller('NavBarController', NavBarController);
    NavBarController.$inject = ['$route', '$rootScope', '$location', '$translate', 'Authentication', 'NavBar'];
    function NavBarController($route, $rootScope, $location, $translate, Authentication, NavBar) {
        var vm = this;
        vm.langEN = langEN;
        vm.langPT = langPT;
        vm.runs = runs;
        vm.users = users;
        vm.logout = logout;
        vm.language = undefined;
        vm.pageTitle = undefined;
        vm.showNavBar = false;
        vm.showUsersMenuItem = false;
        activate();
        function activate() {
            if ($location.url() === '/login' || Authentication.isAuthenticated()) {
                init();
            }
            else {
                $location.url('/');
            }
        }
        function init() {
            vm.language = NavBar.getPreferredLanguage();
            NavBar.setPreferredLanguage(vm.language);
            setTimeout(refresh, 500);
            $rootScope.$on('$routeChangeSuccess', function (event) {
                refresh();
            });
            $rootScope.$on('LANGUAGE_UPDATED', function (event) {
                refresh();
            });
        }
        function refresh() {
            $translate($route.current.pageTitle).then(function (translatedValue) {
                vm.pageTitle = translatedValue;
            });
            var authToken = Authentication.getCookiesAuthToken();
            vm.showNavBar = !!authToken;
            if (!!authToken) {
                vm.showUsersMenuItem = getShowUsersMenuItem(authToken.user);
            }
        }
        function langEN() {
            vm.language = 'en';
            NavBar.setPreferredLanguage(vm.language);
        }
        function langPT() {
            vm.language = 'pt';
            NavBar.setPreferredLanguage(vm.language);
        }
        function runs() {
            $location.url('/runs');
        }
        function users() {
            $location.url('/users');
        }
        function logout() {
            Authentication.logout();
            setTimeout(function () {
                Authentication.unauthenticate();
                $location.url('/');
            }, 500);
        }
        function getShowUsersMenuItem(userInfo) {
            if (!!userInfo) {
                return userInfo.admin === true ||
                    userInfo.manager === true;
            }
            return true;
        }
    }
})();
//# sourceMappingURL=navbar.controller.js.map