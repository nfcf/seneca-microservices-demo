describe('Login controller', function () {
  var $controller, $q, scope, $location, Authentication;
  var vm;

  beforeEach(function () {
    module('app');
    module('app.authentication');
  });

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _$location_, _Authentication_, _$httpBackend_) {
    $controller = _$controller_;
    $q = _$q_;
    scope = _$rootScope_.$new();
    $location = _$location_;
    Authentication = _Authentication_;

    _$httpBackend_.when('GET', 'resources/locale-en.json').respond({
      HEADER: 'Header'
    });
    _$httpBackend_.when('GET', 'resources/locale-pt.json').respond({
      HEADER: 'Header'
    });

    vm = $controller('loginController', {
      $scope: scope,
      $location: $location,
      Authentication: Authentication
    });
  }));

  it('should exist', function () {
    expect($controller).toBeDefined();
  });

  describe('.login()', function () {
    beforeEach(inject(function () {
      spyOn(Authentication, 'setCookiesAuthToken').and.callThrough();
      spyOn($location, 'url').and.callThrough();
    }));

    it('should login user if valid credentials', function () {
      spyOn(Authentication, 'login').and.callFake(function () {
        var deferred = $q.defer();
        deferred.resolve({
          data: {
            ok: true,
            auth_token: 'dummy'
          }
        });
        return deferred.promise;
      });

      expect(vm.loginError).toBe(undefined);

      vm.email = 'email';
      vm.password = 'password';
      vm.login();

      scope.$digest();
      expect(Authentication.login).toHaveBeenCalledWith(vm.email, vm.password);
      expect(Authentication.setCookiesAuthToken).toHaveBeenCalledWith({
        ok: true,
        auth_token: 'dummy'
      });
      expect($location.url).toHaveBeenCalledWith('/runs');
    });

    it('should fail to login user if invalid credentials', function () {
      spyOn(Authentication, 'login').and.callFake(function () {
        var deferred = $q.defer();
        deferred.reject({
          status: 500,
          statusText: 'error'
        });
        return deferred.promise;
      });

      expect(vm.loginError).toBe(undefined);

      vm.email = 'wrong';
      vm.password = 'wrong';
      vm.login();

      scope.$digest();
      expect(Authentication.login).toHaveBeenCalledWith(vm.email, vm.password);
      expect(vm.loginError).toBe('error');
    });
  });

  describe('.register()', function () {
    beforeEach(inject(function () {
      spyOn(Authentication, 'login').and.callFake(function () {
        var deferred = $q.defer();
        deferred.resolve({
          data: {
            ok: true,
            auth_token: 'dummy'
          }
        });
        return deferred.promise;
      });
    }));

    it('should register user if params are OK', function () {
      spyOn(Authentication, 'register').and.callFake(function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      });

      expect(vm.registerError).toBe(undefined);

      vm.email = 'email';
      vm.password = 'password';
      vm.confirmPassword = 'password';
      vm.register();

      scope.$digest();
      expect(Authentication.register).toHaveBeenCalledWith(vm.email, vm.password, vm.confirmPassword);
      expect(Authentication.login).toHaveBeenCalled();
    });

    it('should fail to register user if params are invalid', function () {
      spyOn(Authentication, 'register').and.callFake(function () {
        var deferred = $q.defer();
        deferred.reject({
          status: 500,
          statusText: 'error'
        });
        return deferred.promise;
      });

      expect(vm.registerError).toBe(undefined);

      vm.email = 'wrong';
      vm.password = 'wrong';
      vm.confirmPassword = 'wrong';
      vm.register();

      scope.$digest();
      expect(Authentication.register).toHaveBeenCalledWith(vm.email, vm.password, vm.confirmPassword);
      expect(vm.registerError).toBe('error');
    });
  });

  describe('.resetPassword()', function () {
    it('should show not implemented error', function () {
      var action = '/api/v1/account/logout';
      var response = {};

      vm.resetPassword();

      expect(vm.loginError).toBe('Not Implemented Yet...');
    });
  });
});
