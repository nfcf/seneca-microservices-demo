(function () {
    'use strict';

    angular
        .module('app.config')
        .config(config);

    config.$inject = ['$httpProvider', '$locationProvider', '$mdThemingProvider',
        '$translateProvider', '$logProvider'];

    function config($httpProvider, $locationProvider, $mdThemingProvider,
        $translateProvider, $logProvider) {

        $httpProvider.interceptors.push('AuthInterceptor');

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $mdThemingProvider.theme('default').primaryPalette('blue');
        
        //$translateProvider.useLocalStorage();
        $translateProvider.registerAvailableLanguageKeys(['en', 'pt']);
        $translateProvider.useStaticFilesLoader({
            prefix: "resources/locale-",
            suffix: ".json"
        });
        $translateProvider.useSanitizeValueStrategy('sceParameters'); //'sanitize'

        $translateProvider.preferredLanguage('en');

        $logProvider.debugEnabled(false);
    }

})();