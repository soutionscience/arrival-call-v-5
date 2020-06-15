import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackingPageRoutingModule } from './tracking-routing.module';

import { TrackingPage } from './tracking.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackingPageRoutingModule
  ],
  providers:[Geolocation, BackgroundMode],
  declarations: [TrackingPage]
})
export class TrackingPageModule {}
