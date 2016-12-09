describe('Runs service', function () {
    var Runs, $q, $httpBackend, apiBaseURL;
    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('app.runs.services'));
    beforeEach(inject(function (_Runs_, _$q_, _$httpBackend_, _apiBaseURL_) {
        Runs = _Runs_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        apiBaseURL = _apiBaseURL_;
        $httpBackend.when('GET', 'resources/locale-en.json').respond({
            HEADER: 'Header'
        });
        $httpBackend.when('GET', 'resources/locale-pt.json').respond({
            HEADER: 'Header'
        });
    }));
    it('should exist', function () {
        expect(Runs).toBeDefined();
    });
    describe('.list()', function () {
        var result;
        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};
            // Spy on our service call but allow it to continue to its implementation
            spyOn(Runs, 'list').and.callThrough();
        });
        it('should return a list of runs', function () {
            var action = '/api/v1/runs/';
            var query = {};
            var response = [{
                    id: 1
                }, {
                    id: 2
                }, {
                    id: 3
                }];
            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenGET(apiBaseURL + action).respond(200, $q.when(response));
            expect(Runs.list).not.toHaveBeenCalled();
            expect(result).toEqual({});
            Runs.list(query).then(function (res) {
                result = res.data;
            });
            // Flush pending HTTP requests
            $httpBackend.flush();
            expect(Runs.list).toHaveBeenCalledWith(query);
            expect(result.$$state.value.length).toEqual(3);
        });
    });
    describe('.get()', function () {
        var result;
        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};
            // Spy on our service call but allow it to continue to its implementation
            spyOn(Runs, "get").and.callThrough();
        });
        it('should return a specific run', function () {
            var action = '/api/v1/runs/';
            var id = 1;
            var response = {
                id: 1
            };
            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenGET(apiBaseURL + action + id + '/').respond(200, $q.when(response));
            expect(Runs.get).not.toHaveBeenCalled();
            expect(result).toEqual({});
            Runs.get(id).then(function (res) {
                result = res.data;
            });
            // Flush pending HTTP requests
            $httpBackend.flush();
            expect(Runs.get).toHaveBeenCalledWith(id);
            expect(result.$$state.value.id).toEqual(1);
        });
    });
    describe('.destroy()', function () {
        var result;
        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};
            // Spy on our service call but allow it to continue to its implementation
            spyOn(Runs, 'destroy').and.callThrough();
        });
        it('should return success if the operation succeeded', function () {
            var action = '/api/v1/runs/';
            var meal = {
                id: 1
            };
            var response = {};
            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenDELETE(apiBaseURL + action + meal.id + '/').respond(200, $q.when(response));
            expect(Runs.destroy).not.toHaveBeenCalled();
            expect(result).toEqual({});
            Runs.destroy(meal).then(function (res) {
                result = res.data;
            });
            // Flush pending HTTP requests
            $httpBackend.flush();
            expect(Runs.destroy).toHaveBeenCalledWith(meal);
        });
    });
    describe('.update()', function () {
        var result;
        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};
            // Spy on our service call but allow it to continue to its implementation
            spyOn(Runs, "update").and.callThrough();
        });
        it('should return success if the operation succeeded', function () {
            var action = '/api/v1/runs/';
            var meal = {
                id: 1,
                description: 'update'
            };
            var response = {};
            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenPUT(apiBaseURL + action + meal.id + '/').respond(200, $q.when(response));
            expect(Runs.update).not.toHaveBeenCalled();
            expect(result).toEqual({});
            Runs.update(meal).then(function (res) {
                result = res.data;
            });
            // Flush pending HTTP requests
            $httpBackend.flush();
            expect(Runs.update).toHaveBeenCalledWith(meal);
        });
    });
    describe('.create()', function () {
        var result;
        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};
            // Spy on our service call but allow it to continue to its implementation
            spyOn(Runs, 'create').and.callThrough();
        });
        it('should return success if the operation succeeded', function () {
            var action = '/api/v1/runs/';
            var meal = {
                id: 1,
                description: 'create'
            };
            var response = {};
            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenPOST(apiBaseURL + action).respond(201, $q.when(response));
            expect(Runs.create).not.toHaveBeenCalled();
            expect(result).toEqual({});
            Runs.create(meal).then(function (res) {
                result = res.data;
            });
            // Flush pending HTTP requests
            $httpBackend.flush();
            expect(Runs.create).toHaveBeenCalledWith(meal);
        });
    });
    describe('.getStats()', function () {
        var result;
        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};
            // Spy on our service call but allow it to continue to its implementation
            spyOn(Runs, 'getStats').and.callThrough();
        });
        it('should return the distance ran in a week', function () {
            var action = '/api/v1/runs/get/stats/';
            var response = 1500;
            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenGET(apiBaseURL + action).respond(200, $q.when(response));
            expect(Runs.getStats).not.toHaveBeenCalled();
            expect(result).toEqual({});
            Runs.getStats().then(function (res) {
                result = res.data;
            });
            // Flush pending HTTP requests
            $httpBackend.flush();
            expect(Runs.getStats).toHaveBeenCalled();
            expect(result.$$state.value).toEqual(1500);
        });
    });
});
//# sourceMappingURL=runs.service.spec.js.map