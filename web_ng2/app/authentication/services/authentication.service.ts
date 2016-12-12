'use strict';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { downgradeInjectable } from '@angular/upgrade/static';
import { Broadcaster } from 'app/broadcaster';

declare var angular: angular.IAngularStatic;
angular
  .module('app.authentication.services')
  .factory('Authentication', downgradeInjectable(Authentication));

@Injectable()
export class Authentication {
  static $inject = ['$cookieStore', '$http', 'Broadcaster', 'apiBaseUrl'];

  constructor(public $cookieStore: angular.cookies.ICookieStoreService, 
              public $http: angular.IHttpService,
              public broadcaster: Broadcaster,
              public apiBaseURL: string) { }

  register(email, password, confirmPassword) {
    return this.$http.post(this.apiBaseURL + '/auth/register', {
      email: email,
      password: password,
      repeat: confirmPassword
    });
  }

  login(email, password) {
    return this.$http.post(this.apiBaseURL + '/auth/login', {
      email: email,
      password: password
    });
  }

  logout() {
    return this.$http.post(this.apiBaseURL + '/auth/logout', {});
  }

  user() {
    return this.$http.post(this.apiBaseURL + '/auth/user', {});
  }

  isAuthenticated() {
    return !!this.getCookiesAuthToken();
  }

  getCookiesAuthToken() {
    var authToken = this.$cookieStore.get('authToken');
    if (!authToken) {
      return null;
    }

    return authToken;
  }

  setCookiesAuthToken(authToken) {
    this.$cookieStore.put('authToken', authToken);
    this.broadcaster.broadcast('AUTH_TOKEN_UPDATED');
  }

  unauthenticate() {
    this.$cookieStore.remove('authToken');
    this.broadcaster.broadcast('AUTH_TOKEN_UPDATED');
  }
}
