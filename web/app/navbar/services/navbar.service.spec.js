describe('NavBar service', function () {
    var NavBar, $cookieStore, $translate;

    var languages = ['en', 'pt'];

    beforeEach(angular.mock.module('pascalprecht.translate'));
    beforeEach(angular.mock.module('app.navbar.services'));

    beforeEach(inject(function (_NavBar_, _$cookieStore_, _$translate_) {
        NavBar = _NavBar_;
        $cookieStore = _$cookieStore_;
        $translate = _$translate_;
    }));

    it('should exist', function () { 
        expect(NavBar).toBeDefined();
    });

    describe('.getPreferredLanguage()', function () {

        it('should exist', function () {
            expect(NavBar.getPreferredLanguage).toBeDefined();
        });

        it('should return default EN language and persists it (if empty cookies)', function () {
            $cookieStore.remove('preferredLanguage'); //Clear the cookies

            expect(NavBar.getPreferredLanguage()).toEqual($cookieStore.get('preferredLanguage'));
            expect($translate.use()).toEqual('en');
        });

        it('should return correct language from cookie', function () {
            expect(NavBar.getPreferredLanguage()).toEqual($cookieStore.get('preferredLanguage'));
        });

    });

    describe('.setPreferredLanguage()', function () {

        it('should exist', function () {
            expect(NavBar.setPreferredLanguage).toBeDefined();
        });

        it('should change language and updates cookie', function () {
            NavBar.setPreferredLanguage(languages[0]);
            expect($cookieStore.get('preferredLanguage')).toEqual(languages[0]);

            NavBar.setPreferredLanguage(languages[1]);
            expect($cookieStore.get('preferredLanguage')).toEqual(languages[1]);
        });

        it('should change language in translate Provider', function () {
            NavBar.setPreferredLanguage(languages[0]);
            expect($translate.use()).toEqual(languages[0]);

            NavBar.setPreferredLanguage(languages[1]);
            expect($translate.use()).toEqual(languages[1]);
        });
    });

});