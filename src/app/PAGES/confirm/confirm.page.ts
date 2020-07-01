import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/SHARED/models/trip.model';
import { User } from 'src/app/SHARED/models/user.model';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CalService } from 'src/app/SERVICES/cal.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  activeTrip: Trip
  place: Trip;
  user: User
  watch: any;
  messages: string
  distance: any []=[];

  constructor(private appStorage: AppStorageService, private geoLocation: Geolocation,
    private cal: CalService ) { }

  ngOnInit() {
    this.getTripAndUser()
  }
  ionViewWillEnter(){

  }

  getTripAndUser(){
  this.appStorage.getTrip('activeTrip')
  .then((resp)=>{
    this.activeTrip = resp;
    this.place = this.activeTrip;
    this.appStorage.getTrip('user')
    .then((resp)=>{
      this.user = resp
    })

  })
  }

  confirm(){
    console.log('fence ', this.place.fence)
    this.watch = this.geoLocation.watchPosition({enableHighAccuracy: true})
    this.watch.subscribe((data)=>{
      console.log('data ', data)
      let current = {lat:data.coords.latitude, lng: data.coords.longitude };
      
      this.distance.push(this.cal.calculateRadius(this.place.coords, current, this.place.fence));
      this.cal.calculateRadius(this.place.coords, current, this.place.fence)<= this.place.fence?
      this.callClient(): this.tracking()

    })
     
  }

  callClient(){
    console.log('calling client ')
    this.messages = "calling client"
  }
  tracking(){
    console.log('tracking');
    this.messages = "tracking"
  }

}
