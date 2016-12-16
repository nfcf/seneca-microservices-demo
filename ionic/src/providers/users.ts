import { Injectable } from '@angular/core';
import { Globals } from '../app/globals';
import { Http } from '@angular/http';

@Injectable()
export class Users {

  constructor(private http: Http) {
    console.log('Hello Users Provider');
  }

  destroy(item) {
    return this.http.delete(Globals.API_BASE_URL + '/api/v1/users/' + item.id + '/');
  }

  get(id) {
    return this.http.get(Globals.API_BASE_URL + '/api/v1/users/' + id + '/');
  }

  list(query) {
    return this.http.get(Globals.API_BASE_URL + '/api/v1/users/', query);
  }

  update(item) {
    return this.http.put(Globals.API_BASE_URL + '/api/v1/users/' + item.id + '/', {
      entity: item
    });
  }

  create(item) {
    return this.http.post(Globals.API_BASE_URL + '/api/v1/users/', {
      entity: item
    });
  }

}
