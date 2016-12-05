(function () {
  'use strict';

  angular
    .module('app.navbar.services')
    .factory('NavBar', NavBar);

  NavBar.$inject = ['$cookieStore', '$http', '$rootScope', '$translate'];

  function NavBar($cookieStore, $http, $rootScope, $translate) {
    var NavBar = {
      getPreferredLanguage: getPreferredLanguage,
      setPreferredLanguage: setPreferredLanguage
    };
    return NavBar;

    function getPreferredLanguage() {
      if (!$cookieStore.get('preferredLanguage')) {
        setPreferredLanguage('en'); // Default languange
      }
      return $cookieStore.get('preferredLanguage');
    }

    function setPreferredLanguage(key) {
      $cookieStore.put('preferredLanguage', key);
      $translate.use(key).then(function () {
        $rootScope.$broadcast('LANGUAGE_UPDATED');
      });
    }
  }
})();
