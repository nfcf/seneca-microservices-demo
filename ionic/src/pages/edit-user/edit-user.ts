import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

class UserModel {
  email: string;
  name: string;
  admin: boolean;
  manager: boolean;
}

@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html'
})
export class EditUserPage {
  email: string;
  name: string;
  role: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('Hello EditUserPage Page');
  }

  init() {
    let item: UserModel = this.navParams.get('item');
    this.email = item.email;
    this.name = item.name;
    this.role = item.admin ? 'admin' : item.manager ? 'manager' : 'user';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  delete() {}

  save() {}

}
