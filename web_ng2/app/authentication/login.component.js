System.register([], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var LoginController;
    return {
        setters:[],
        execute: function() {
            angular
                .module('app.authentication')
                .component('Login', {
                templateUrl: 'app/authentication/login.template.html',
                controller: LoginController
            });
            LoginController = (function () {
                function LoginController($scope, $location, Authentication) {
                    this.$scope = $scope;
                    this.$location = $location;
                    this.Authentication = Authentication;
                    var vm = this;
                    /*vm.login = login;
                    vm.register = register;
                    vm.resetPassword = resetPassword;*/
                    this.Authentication = Authentication;
                    activate();
                    function activate() {
                        // If the user is authenticated, they should not be here.
                        if (Authentication.isAuthenticated()) {
                            $location.url('/runs');
                        }
                        else {
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
                }
                LoginController.prototype.login = function () {
                    this.loginError = undefined;
                    this.Authentication.login(this.email, this.password).then(successFn, errorFn);
                    function successFn(response, status, headers, config) {
                        if (response.data.ok) {
                            this.Authentication.setCookiesAuthToken(response.data);
                            this.$location.url('/runs');
                        }
                        else {
                            this.loginError = response.data.why;
                        }
                    }
                    function errorFn(response, status, headers, config) {
                        this.loginError = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
                    }
                };
                LoginController.prototype.register = function () {
                    this.registerError = undefined;
                    this.Authentication.register(this.email, this.password, this.confirmPassword).then(successFn, errorFn);
                    function successFn(response, status, headers, config) {
                        this.login();
                    }
                    function errorFn(response, status, headers, config) {
                        this.registerError = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
                    }
                };
                LoginController.prototype.resetPassword = function () {
                    this.loginError = 'Not Implemented Yet...';
                };
                LoginController.$inject = ['$scope', '$location', 'Authentication'];
                return LoginController;
            }());
        }
    }
});
//# sourceMappingURL=login.component.js.map