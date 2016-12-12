System.register(['@angular/core', 'app/authentication/services/authentication.service'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, authentication_service_1;
    var LoginComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (authentication_service_1_1) {
                authentication_service_1 = authentication_service_1_1;
            }],
        execute: function() {
            LoginComponent = (function () {
                function LoginComponent($scope, $location, Authentication) {
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
                LoginComponent.prototype.login = function () {
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
                LoginComponent.prototype.register = function () {
                    this.registerError = undefined;
                    this.Authentication.register(this.email, this.password, this.confirmPassword).then(successFn, errorFn);
                    function successFn(response, status, headers, config) {
                        this.login();
                    }
                    function errorFn(response, status, headers, config) {
                        this.registerError = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
                    }
                };
                LoginComponent.prototype.resetPassword = function () {
                    this.loginError = 'Not Implemented Yet...';
                };
                LoginComponent.$inject = ['$scope', '$location', 'Authentication'];
                LoginComponent = __decorate([
                    core_1.Component({
                        moduleId: module.id,
                        selector: 'login',
                        templateUrl: 'login.template.html'
                    }), 
                    __metadata('design:paramtypes', [Object, Object, (typeof (_a = typeof authentication_service_1.Authentication !== 'undefined' && authentication_service_1.Authentication) === 'function' && _a) || Object])
                ], LoginComponent);
                return LoginComponent;
                var _a;
            }());
            exports_1("LoginComponent", LoginComponent);
        }
    }
});
//# sourceMappingURL=login.component.js.map