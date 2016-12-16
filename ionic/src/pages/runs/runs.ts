import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Authentication } from '../../providers/authentication';
import { Runs } from '../../providers/runs';

@Component({
  selector: 'page-runs',
  templateUrl: 'runs.html',
  providers: [Runs]
})
export class RunsPage {
  query: any;
  items: Array<{createdBy: string, description: string, distance: string, occurredAt: Date}>;

  constructor(public navCtrl: NavController, public auth: Authentication, private runs: Runs) {
      this.init()
  }

  init() {
    var self = this;

    this.runs.list(this.query).subscribe(
      response => listSuccess(response.json()),
      err => console.log(err),
      () => console.log('list runs completed')
    );

    function listSuccess(data) {
      self.items = data;
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    /*this.navCtrl.push(UsersPage, {
      item: item
    });*/
  }

  showErrorMessage(msg) {
    /*let alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: msg, // 'Could not authenticate user',
      buttons: ['OK']
    });
    alert.present();

    this.showSpinner = false;
    this.round = false;
    this.expand = false;*/
  }

}
