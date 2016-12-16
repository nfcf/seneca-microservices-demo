import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { NgRadio } from 'ng-radio';
import { Globals } from '../app/globals';

@Injectable()
export class HttpService extends Http {

  constructor (backend: XHRBackend, options: RequestOptions, public radio: NgRadio) {
    super(backend, options);
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    let jwt = JSON.parse(localStorage.getItem(Globals.LOCAL_JWT) || '{}');
    let token = jwt && jwt.login ? jwt.login.token : undefined; 

    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (!options) {
        // let's make option object
        options = {headers: new Headers()};
      }
      options.headers.set('Authorization', token);
    } else {
    // we have to add the token to the url object
      url.headers.set('Authorization', token);
    }
    return super.request(url, options).catch(this.catchAuthError(this));
  }

  private catchAuthError (self: HttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      console.log('catch auth error' + res);
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        self.radio.cast('auth:logout', true);
      }
      return Observable.throw(res);
    };
  }
}