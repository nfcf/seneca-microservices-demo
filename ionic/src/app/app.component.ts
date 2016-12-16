import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { NgRadio } from 'ng-radio';

import { Authentication } from '../providers/authentication';
import { LoginPage } from '../pages/login/login';
import { RunsPage } from '../pages/runs/runs';
import { UsersPage } from '../pages/users/users';


@Component({
  templateUrl: 'app.html',
  providers: [Authentication]
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, private auth: Authentication, private radio: NgRadio) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Runs', component: RunsPage },
      { title: 'Users', component: UsersPage }
    ];

  }

  initializeApp() {
    var self = this;

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.radio.on('auth:logout').subscribe(
      msg => self.logout()
    );
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component)
      .catch(() => {
        console.log('User must be signed in');
      });
  }

  logout() {
    this.auth.unauthenticate();

    this.auth.logout().subscribe();

    this.nav.setRoot(LoginPage)
  }
}
