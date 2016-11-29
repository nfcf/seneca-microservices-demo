(function () {
    'use strict';

    angular
        .module('app.authentication.services')
        .factory('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['$cookieStore', '$location', '$q'];

    function AuthInterceptor($cookieStore, $location, $q) {

        var AuthInterceptor = {
            request: request,
            responseError: responseError
        };
        return AuthInterceptor;

        /////////////////////

        function request (config) {

            config.headers = config.headers || {};

            var authToken = $cookieStore.get('authToken');
            if (authToken) {
                config.headers.Authorization = authToken.login.token;
            }

            return config;
        }

        function responseError (rejection) {
            if (rejection.status === 401 && rejection.config.method === 'GET') {
                $cookieStore.remove('authToken');
                $location.path('/');
            }
            return $q.reject(rejection);
        }
    }
})();