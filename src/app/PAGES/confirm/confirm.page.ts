import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/SHARED/models/trip.model';
import { User } from 'src/app/SHARED/models/user.model';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CalService } from 'src/app/SERVICES/cal.service';
import { ApiService } from 'src/app/SERVICES/api.service';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;


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
  userNumber : string;

  constructor(private appStorage: AppStorageService,
    private cal: CalService, private api: ApiService ) { }

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
    this.watch = Geolocation.watchPosition({}, (data, err)=>{
      if(err) console.log(err)
      let current = {lat:data.coords.latitude, lng: data.coords.longitude };
      if( this.cal.calculateRadius(this.place.coords, current, this.place.fence)<= this.place.fence){
        this.stop();
        this.callClient()
      }else{
        this.tracking()

      }
    
      
    })

  }
  stop(){
    //console.log('stop called')
    Geolocation.clearWatch({id: this.watch})
  }

  // confirm(){
  //   console.log('fence ', this.place.fence)
  //    this.watch = Geolocation.watchPosition({enableHighAccuracy: true})
  //     this.watch.subscribe((data)=>{
  //     console.log('data ', data)
  //     let current = {lat:data.coords.latitude, lng: data.coords.longitude };
      
  //     this.distance.push(this.cal.calculateRadius(this.place.coords, current, this.place.fence));
  //    if( this.cal.calculateRadius(this.place.coords, current, this.place.fence)<= this.place.fence){

  //     this.callClient();

  //    }else{
  //     this.tracking()
  //    }


  //   })
     
  // }

  callClient(){
    this.userNumber = this.user.countryCode + this.user.phone 
//console.log('calling client ', this.userNumber)
    this.messages = "calling client";
    
    this.api.postResource('call', {'number': this.userNumber} )
    .subscribe((resp)=>{
      console.log('user called')
    })
  }
  tracking(){
    console.log('tracking');
    this.messages = "tracking"
  }

}
