import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { EditUserPage } from '../../pages/edit-user/edit-user';
import { Authentication } from '../../providers/authentication';
import { Users } from '../../providers/users';

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
  providers: [Users]
})
export class UsersPage {
  query: any;
  selectedItem: any;
  items: Array<{id: string, email: string, name: string, role: string}>;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public auth: Authentication, private users: Users) {
    this.init();
  }

  init() {
    var self = this;

    this.users.list(this.query).subscribe(
      response => listSuccess(response.json()),
      err => console.log(err),
      () => console.log('list users completed')
    );

    function listSuccess(data) {
      self.items = data;
    }
  }

  itemTapped(event, item) {
    let modal = this.modalCtrl.create(EditUserPage, { item: item });
    modal.onDidDismiss(data => {
     console.log(data);
   });
   modal.present();
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
