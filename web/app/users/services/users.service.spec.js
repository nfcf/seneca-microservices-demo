describe('Users service', function () {
    var Users, $q, $httpBackend;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('app.users.services'));

    beforeEach(inject(function (_Users_, _$q_, _$httpBackend_, _apiBaseURL_) {
        Users = _Users_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        apiBaseURL = _apiBaseURL_;

        $httpBackend.when('GET', 'resources/locale-en.json').respond({ HEADER: 'Header' });
        $httpBackend.when('GET', 'resources/locale-pt.json').respond({ HEADER: 'Header' });
    }));

    it('should exist', function () {
        expect(Users).toBeDefined();
    });

    describe('.list()', function () {
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Users, "list").and.callThrough();
        });

        it('should return a list of users', function () {
            var action = '/api/v1/users/';
            var query = {};
            var response = [{id: 1}, {id: 2}, {id: 3}];

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenGET(apiBaseURL + action).respond(200, $q.when(response));

            expect(Users.list).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Users.list(query).then(function (res) {
                result = res.data;
            });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Users.list).toHaveBeenCalledWith(query);
            expect(result.$$state.value.length).toEqual(3);
        });
    });

    describe('.get()', function () {
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Users, "get").and.callThrough();
        });

        it('should return a specific user', function () {
            var action = '/api/v1/users/';
            var id = 1;
            var response = { id: 1 };

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenGET(apiBaseURL + action + id + '/').respond(200, $q.when(response));

            expect(Users.get).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Users.get(id).then(function (res) {
                result = res.data;
            });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Users.get).toHaveBeenCalledWith(id);
            expect(result.$$state.value.id).toEqual(1);
        });
    });

    describe('.destroy()', function () {
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Users, "destroy").and.callThrough();
        });

        it('should return success if the operation succeeds', function () {
            var action = '/api/v1/users/';
            var meal = {id: 1};
            var response = {};

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenDELETE(apiBaseURL + action + meal.id + '/').respond(200, $q.when(response));

            expect(Users.destroy).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Users.destroy(meal).then(function (res) {
                result = res.data;
            });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Users.destroy).toHaveBeenCalledWith(meal);
        });
    });

    describe('.update()', function () {
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Users, "update").and.callThrough();
        });

        it('should return success if the operation succeeds', function () {
            var action = '/api/v1/users/';
            var meal = { id: 1, description: 'update' };
            var response = {};

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenPUT(apiBaseURL + action + meal.id + '/').respond(200, $q.when(response));

            expect(Users.update).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Users.update(meal).then(function (res) {
                result = res.data;
            });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Users.update).toHaveBeenCalledWith(meal);
        });
    });

});