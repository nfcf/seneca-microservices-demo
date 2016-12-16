import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { NgRadio } from 'ng-radio';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RunsPage } from '../pages/runs/runs';
import { UsersPage } from '../pages/users/users';
import { EditUserPage } from '../pages/edit-user/edit-user';

import { HttpService } from '../providers/httpService';
import { Authentication } from '../providers/authentication';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RunsPage,
    UsersPage,
    EditUserPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RunsPage,
    UsersPage,
    EditUserPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, NgRadio]
    },
    Authentication,
    NgRadio
  ]
})
export class AppModule {}

export function httpFactory(backend: XHRBackend, options: RequestOptions, radio: NgRadio) {
  return new HttpService(backend, options, radio);
}
