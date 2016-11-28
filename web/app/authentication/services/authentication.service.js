(function () {
    'use strict';

    angular
        .module('app.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$rootScope', '$cookieStore', '$http', 'apiBaseURL'];

    function Authentication($rootScope, $cookieStore, $http, apiBaseURL) {

        var Authentication = {
            login: login,
            logout: logout,
            register: register,
            user: user,
            isAuthenticated: isAuthenticated,
            getCookiesAuthToken: getCookiesAuthToken,
            setCookiesAuthToken: setCookiesAuthToken,
            unauthenticate: unauthenticate
        };
        return Authentication;

        /////////////////////

        function register(email, password, confirmPassword) {
            return $http.post(apiBaseURL + '/auth/register', { email: email, password: password, repeat: confirmPassword});
        }

        function login(email, password) {
            return $http.post(apiBaseURL + '/auth/login', { email: email, password: password });
        }

        function logout() {
            return $http.post(apiBaseURL + '/auth/logout');
        }

        function user() {
            return $http.post(apiBaseURL + '/auth/user');
        }

        function isAuthenticated() {
            return !!getCookiesAuthToken();
        }

        function getCookiesAuthToken() {
            var authToken = $cookieStore.get('authToken');
            if (!authToken) {
                return null;
            }

            return authToken;
        }

        function setCookiesAuthToken(authToken) {
            $cookieStore.put('authToken', authToken);
            $rootScope.$broadcast('AUTH_TOKEN_UPDATED');
        }

        function unauthenticate() {
            $cookieStore.remove('authToken');
            $rootScope.$broadcast('AUTH_TOKEN_UPDATED');
        }
    }
})();