(function () {
    'use strict';

    angular
        .module('app.users.services')
        .factory('Users', Users);

    Users.$inject = ['$rootScope', '$cookieStore', '$http', 'apiBaseURL'];

    function Users($rootScope, $cookieStore, $http, apiBaseURL) {

        var Users = {
            destroy: destroy,
            get: get,
            list: list,
            update: update,
            getCookiesUserInfo: getCookiesUserInfo,
            setCookiesUserInfo: setCookiesUserInfo
        };
        return Users;

        /////////////////////

        function destroy(item) {
            return $http.delete(apiBaseURL + '/api/v1/users/' + item.id + '/');
        }

        function get(id) {
            return $http.get(apiBaseURL + '/api/v1/users/' + id + '/');
        }

        function list(query) {
            return $http.get(apiBaseURL + '/api/v1/users/', { params: query });
        }

        function update(item) {
            return $http.put(apiBaseURL + '/api/v1/users/' + item.id + '/', item);
        }

        function getCookiesUserInfo() {
            var userInfo = $cookieStore.get('userInfo');
            if (!userInfo) {
                return null;
            }

            return userInfo;
        }

        function setCookiesUserInfo(userInfo) {
            $cookieStore.put('userInfo', userInfo);
            $rootScope.$broadcast('USER_INFO_UPDATED');
        }

    }
})();