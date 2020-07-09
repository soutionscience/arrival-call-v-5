import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmPageRoutingModule } from './confirm-routing.module';

import { ConfirmPage } from './confirm.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmPageRoutingModule,
  ],
  providers:[Geolocation, BackgroundMode, Insomnia],
  declarations: [ConfirmPage]
})
export class ConfirmPageModule {}
