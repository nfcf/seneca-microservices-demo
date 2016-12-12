System.register(['@angular/core', '@angular/upgrade/static', 'app/broadcaster'], function(exports_1, context_1) {
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
    var core_1, static_1, broadcaster_1;
    var Authentication;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (static_1_1) {
                static_1 = static_1_1;
            },
            function (broadcaster_1_1) {
                broadcaster_1 = broadcaster_1_1;
            }],
        execute: function() {
            angular
                .module('app.authentication.services')
                .factory('Authentication', static_1.downgradeInjectable(Authentication));
            Authentication = (function () {
                function Authentication($cookieStore, $http, broadcaster, apiBaseURL) {
                    this.$cookieStore = $cookieStore;
                    this.$http = $http;
                    this.broadcaster = broadcaster;
                    this.apiBaseURL = apiBaseURL;
                }
                Authentication.prototype.register = function (email, password, confirmPassword) {
                    return this.$http.post(this.apiBaseURL + '/auth/register', {
                        email: email,
                        password: password,
                        repeat: confirmPassword
                    });
                };
                Authentication.prototype.login = function (email, password) {
                    return this.$http.post(this.apiBaseURL + '/auth/login', {
                        email: email,
                        password: password
                    });
                };
                Authentication.prototype.logout = function () {
                    return this.$http.post(this.apiBaseURL + '/auth/logout', {});
                };
                Authentication.prototype.user = function () {
                    return this.$http.post(this.apiBaseURL + '/auth/user', {});
                };
                Authentication.prototype.isAuthenticated = function () {
                    return !!this.getCookiesAuthToken();
                };
                Authentication.prototype.getCookiesAuthToken = function () {
                    var authToken = this.$cookieStore.get('authToken');
                    if (!authToken) {
                        return null;
                    }
                    return authToken;
                };
                Authentication.prototype.setCookiesAuthToken = function (authToken) {
                    this.$cookieStore.put('authToken', authToken);
                    this.broadcaster.broadcast('AUTH_TOKEN_UPDATED');
                };
                Authentication.prototype.unauthenticate = function () {
                    this.$cookieStore.remove('authToken');
                    this.broadcaster.broadcast('AUTH_TOKEN_UPDATED');
                };
                Authentication.$inject = ['$cookieStore', '$http', 'Broadcaster', 'apiBaseUrl'];
                Authentication = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Object, Function, (typeof (_a = typeof broadcaster_1.Broadcaster !== 'undefined' && broadcaster_1.Broadcaster) === 'function' && _a) || Object, String])
                ], Authentication);
                return Authentication;
                var _a;
            }());
            exports_1("Authentication", Authentication);
        }
    }
});
//# sourceMappingURL=authentication.service.js.map