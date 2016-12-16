import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Authentication } from '../../providers/authentication';
import { RunsPage } from '../../pages/runs/runs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Authentication]
})
export class LoginPage {
  segment: any;
  
  email: string;
  password: string;
  repeatPassword: string;

  showSpinner: boolean;
  spinnerColor: string;
  round: boolean;
  expand: boolean;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private auth: Authentication) { 
    this.showSpinner = false;
    this.spinnerColor = 'light';

    if (this.auth.isAuthenticated()) {
      this.navCtrl.setRoot(RunsPage);
    }
  }

  ionViewDidLoad() {
    // console.log('Hello LoginPage Page');
  }

  register() {
    this.round = true;
    this.showSpinner = true;

    this.auth.register(this.email, this.password, this.repeatPassword).subscribe(
      response => this.login(),
      err => this.showErrorMessage(err),
      () => console.log('register completed')
    );
  }

  login() {
    this.round = true;
    this.showSpinner = true;

    this.auth.login(this.email, this.password).subscribe(
      response => this.loginSuccess(response.json()),
      err => this.showErrorMessage(err),
      () => console.log('login completed')
    );
  }

  private loginSuccess(data) {
    this.spinnerColor = 'danger';
    this.expand = true;

    if (data.ok) {
      this.auth.setCookiesAuthToken(data);
      setTimeout(() => { this.navCtrl.setRoot(RunsPage); }, 300)
    }
    else {
      this.showErrorMessage(data.why);
    }
  }

  showErrorMessage(msg) {
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: msg, // 'Could not authenticate user',
      buttons: ['OK']
    });
    alert.present();

    this.showSpinner = false;
    this.round = false;
    this.expand = false;
  }

  isInvalid() {
    if (this.email == null || this.email.length < 1 || this.password == null || this.password.length < 1) {
        return true;
      } else {
        return false;
      }
  }

  setClass() {
    let classes = {
      round: this.round,
      expand: this.expand
    };
    return classes;
  }

}
