import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpModule } from '@angular/http';

import { Authentication } from 'app/authentication/services/authentication.service';
import { Broadcaster } from 'app/broadcaster';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
    HttpModule
  ],
  providers: [
    Authentication,
    Broadcaster
  ]
})
export class AppModule {
  ngDoBootstrap() {}
}

