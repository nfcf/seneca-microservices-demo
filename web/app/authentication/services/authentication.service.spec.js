describe('Authentication service', function () {
    var Authentication, $rootScope, $cookieStore, $q, $httpBackend;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('app.authentication.services'));

    beforeEach(inject(function (_Authentication_, _$rootScope_, _$cookieStore_, _$q_, _$httpBackend_, _apiBaseURL_) {
        Authentication = _Authentication_;
        $rootScope = _$rootScope_;
        $cookieStore = _$cookieStore_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        apiBaseURL = _apiBaseURL_;

        $httpBackend.when('GET', 'resources/locale-en.json').respond({ HEADER: 'Header' });
        $httpBackend.when('GET', 'resources/locale-pt.json').respond({ HEADER: 'Header' });
    }));

    it('should exist', function () {
        expect(Authentication).toBeDefined();
    });

    describe('.register()', function () {
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Authentication, "register").and.callThrough();
        });

        it('should register user if all is OK', function () {
            var action = '/api/v1/account/register';
            var response = {};

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenPOST(apiBaseURL + action).respond(200, $q.when(response));

            expect(Authentication.register).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Authentication.register('email', 'password', 'password').then(function (res) {
                result = res.data;
            });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Authentication.register).toHaveBeenCalledWith('email', 'password', 'password');
        });
    });

    describe('.login()', function () {
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Authentication, "login").and.callThrough();
        });

        it('should login user if credentials are OK', function () {
            var action = '/token';
            var response = {access_token: 'dummy', userId: '1'};

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenPOST(apiBaseURL + action).respond(200, $q.when(response));

            expect(Authentication.login).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Authentication.login('email', 'password').then(function (res) {
                result = res.data;
            });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Authentication.login).toHaveBeenCalledWith('email', 'password');
            expect(result.$$state.value.access_token).toEqual('dummy');
        });
    });

    describe('.logout()', function () {
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Authentication, "logout").and.callThrough();
        });

        it('should logout user', function () {
            var action = '/api/v1/account/logout';
            var response = {};

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenPOST(apiBaseURL + action).respond(200, $q.when(response));

            expect(Authentication.logout).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Authentication.logout().then(function (res) {
                result = res.data;
            });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Authentication.logout).toHaveBeenCalled();
        });
    });

    describe('.isAuthenticated()', function () {
        it('should return true if authToken cookie exists', function () {
            $cookieStore.put('authToken', { dummy: 'dummy' });

            expect(Authentication.isAuthenticated()).toBe(true);

        });

        it('should return false if authToken cookie does not exist', function () {
            $cookieStore.remove('authToken');

            expect(Authentication.isAuthenticated()).toBe(false);

        });
    });

    describe('.getCookiesAuthToken()', function () {
        it('should return cookie if it exists and is still valid (not expired)', function () {
            var cookie = { dummy: 'dummy' };
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            cookie['.expires'] = tomorrow.toISOString();

            $cookieStore.put('authToken', cookie);

            expect(Authentication.getCookiesAuthToken()).toEqual(cookie);
        });

        it('should return null if it the cookie does not exist', function () {
            $cookieStore.remove('authToken');

            expect(Authentication.getCookiesAuthToken()).toBe(null);

        });

        it('should return null if cookie has expired', function () {
            var cookie = { dummy: 'dummy' };
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            cookie['.expires'] = yesterday.toISOString();

            $cookieStore.put('authToken', cookie);
            expect(Authentication.getCookiesAuthToken()).toBe(null);
        });
    });

    describe('.setCookiesAuthToken()', function () {

        beforeEach(function () {
            spyOn($rootScope, '$broadcast');
        });

        it('should exist', function () {
            expect(Authentication.setCookiesAuthToken).toBeDefined();
        });

        it('should set cookie and broadcast', function () {
            var cookie = { dummy: 'dummy' };
            $cookieStore.remove('authToken'); //Clear the cookies

            Authentication.setCookiesAuthToken(cookie);
            expect($cookieStore.get('authToken')).toEqual(cookie);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('AUTH_TOKEN_UPDATED');
        });

    });

    describe('.unauthenticate()', function () {

        beforeEach(function () {
            spyOn($rootScope, '$broadcast');
        });

        it('should exist', function () {
            expect(Authentication.unauthenticate).toBeDefined();
        });

        it('should remove cookie and broadcast', function () {
            var cookie = { dummy: 'dummy' };
            $cookieStore.put('authToken', cookie);

            Authentication.unauthenticate();
            expect($cookieStore.get('authToken')).toEqual(undefined);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('AUTH_TOKEN_UPDATED');
        });

    });

});