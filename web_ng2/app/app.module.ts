import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpModule } from '@angular/http';

import { Authentication } from 'app/authentication/services/authentication.service';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
    HttpModule
  ],
  providers: [
    Authentication
  ]
})
export class AppModule {
  ngDoBootstrap() {}
}

