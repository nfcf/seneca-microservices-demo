(function () {
    'use strict';

    angular
        .module('app.authentication.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$location', 'Authentication'];

    function LoginController($scope, $location, Authentication) {
        var vm = this;
        vm.login = login;
        vm.register = register;
        vm.resetPassword = resetPassword;

        vm.loginError = undefined;
        vm.registerError = undefined;

        vm.email = undefined;
        vm.password = undefined;
        vm.confirmPassword = undefined;

        activate();

        function activate() {
            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                $location.url('/runs');
            } else {
                angular.element('.toggle').on('click', function () {
                    $scope.$apply(function () { vm.loginError = undefined; });
                    angular.element('.container').stop().addClass('active');
                });

                angular.element('.close').on('click', function () {
                    $scope.$apply(function () { vm.registerError = undefined; });
                    angular.element('.container').stop().removeClass('active');
                });
            }
        }

        function login() {
            vm.loginError = undefined;
            Authentication.login(vm.email, vm.password).then(successFn, errorFn);

            function successFn(response, status, headers, config) {
                if (response.data.ok) {
                    Authentication.setCookiesAuthToken(response.data);
                    $location.url('/runs');
                } else {
                    vm.loginError = response.data.why;    
                }
            }

            function errorFn(response, status, headers, config) {
                vm.loginError = response.status != 500 ? JSON.stringify(response.data) : response.statusText;
            }
        }

        function register() {
            vm.registerError = undefined;
            Authentication.register(vm.email, vm.password, vm.confirmPassword).then(successFn, errorFn);

            function successFn(response, status, headers, config) {
                login();
            }

            function errorFn(response, status, headers, config) {
                vm.registerError = response.status != 500 ? JSON.stringify(response.data) : response.statusText;
            }
        }

        function resetPassword() {
            vm.loginError = "Not Implemented Yet...";
        }
    }
})();