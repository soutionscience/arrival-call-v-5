import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, NavParams } from '@ionic/angular';

import { SingleTrackingPageRoutingModule } from './single-tracking-routing.module';

import { SingleTrackingPage } from './single-tracking.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleTrackingPageRoutingModule,
    ReactiveFormsModule
  ],
  providers: [NavParams, Geolocation, BackgroundMode],
  declarations: [SingleTrackingPage]
})
export class SingleTrackingPageModule {}
