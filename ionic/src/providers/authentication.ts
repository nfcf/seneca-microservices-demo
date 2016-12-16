import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Globals } from '../app/globals';
import { Http } from '@angular/http';

@Injectable()
export class Authentication {

  constructor(private http: Http) {
    console.log('Hello Authentication Provider');
  }

  register(email, password, confirmPassword) {
    return this.http.post(Globals.API_BASE_URL + '/auth/register', {
      email: email,
      password: password,
      repeat: confirmPassword
    });
  }

  login(email, password) {
    return this.http.post(Globals.API_BASE_URL + '/auth/login', {
      email: email,
      password: password
    });
  }

  logout() {
    return this.http.post(Globals.API_BASE_URL + '/auth/logout', null);
  }

  user() {
    return this.http.post(Globals.API_BASE_URL + '/auth/user', null);
  }

  isAuthenticated() {
    return !!this.getCookiesAuthToken();
  }

  getCookiesAuthToken() {
    var authToken = localStorage.getItem(Globals.LOCAL_JWT);
    if (!authToken) {
      return null;
    }

    return JSON.parse(authToken);
  }

  setCookiesAuthToken(authToken) {
    localStorage.setItem(Globals.LOCAL_JWT, JSON.stringify(authToken));
    //$rootScope.$broadcast('AUTH_TOKEN_UPDATED');
  }

  unauthenticate() {
    localStorage.removeItem(Globals.LOCAL_JWT);
    //$rootScope.$broadcast('AUTH_TOKEN_UPDATED');
  }

}
