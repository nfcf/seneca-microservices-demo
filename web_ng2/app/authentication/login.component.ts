
'use strict';

import { Component } from '@angular/core';
import { Authentication } from 'app/authentication/services/authentication.service';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.template.html'
})

export class LoginComponent {
  loginError: string;
  registerError: string;
  email: string;
  password: string;
  confirmPassword: string;

  static $inject = ['$scope', '$location', 'Authentication'];

  constructor(public $scope: angular.IScope, public $location: angular.ILocationService, public Authentication: Authentication) {
    var vm = this;
    /*vm.login = login;
    vm.register = register;
    vm.resetPassword = resetPassword;*/

    this.Authentication = Authentication;

    activate();

    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/runs');
      }
      else {
        angular.element('.toggle').on('click', function () {
          $scope.$apply(function () { vm.loginError = undefined; });
          angular.element('.container').stop().addClass('active');
        });

        angular.element('.close').on('click', function () {
          $scope.$apply(function () { vm.registerError = undefined; });
          angular.element('.container').stop().removeClass('active');
        });
      }
    }
  }

  login() {
    this.loginError = undefined;
    this.Authentication.login(this.email, this.password).then(successFn, errorFn);

    function successFn(response, status, headers, config) {
      if (response.data.ok) {
        this.Authentication.setCookiesAuthToken(response.data);
        this.$location.url('/runs');
      }
      else {
        this.loginError = response.data.why;
      }
    }

    function errorFn(response, status, headers, config) {
      this.loginError = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
    }
  }

  register() {
    this.registerError = undefined;
    this.Authentication.register(this.email, this.password, this.confirmPassword).then(successFn, errorFn);

    function successFn(response, status, headers, config) {
      this.login();
    }

    function errorFn(response, status, headers, config) {
      this.registerError = response.status !== 500 ? JSON.stringify(response.data) : response.statusText;
    }
  }

  resetPassword() {
    this.loginError = 'Not Implemented Yet...';
  }
}
