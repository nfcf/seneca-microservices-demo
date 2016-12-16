import { Injectable } from '@angular/core';
import { Globals } from '../app/globals';
import { Http } from '@angular/http';

@Injectable()
export class Runs {

  constructor(private http: Http) {
    console.log('Hello Runs Provider');
  }

  destroy(item) {
    return this.http.delete(Globals.API_BASE_URL + '/api/v1/runs/' + item.id + '/');
  }

  get(id) {
    return this.http.get(Globals.API_BASE_URL + '/api/v1/runs/' + id + '/');
  }

  list(query) {
    return this.http.get(Globals.API_BASE_URL + '/api/v1/runs/', query);
  }

  update(item) {
    return this.http.put(Globals.API_BASE_URL + '/api/v1/runs/' + item.id + '/', {
      entity: item
    });
  }

  create(item) {
    return this.http.post(Globals.API_BASE_URL + '/api/v1/runs/', {
      entity: item
    });
  }

  getStats() {
    return this.http.get(Globals.API_BASE_URL + '/api/v1/runs/get/stats/');
  }

}
