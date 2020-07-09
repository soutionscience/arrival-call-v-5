import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/SHARED/models/trip.model';
import { User } from 'src/app/SHARED/models/user.model';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CalService } from 'src/app/SERVICES/cal.service';
import { ApiService } from 'src/app/SERVICES/api.service';
import { Plugins } from '@capacitor/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';



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
  messages: any [] =[]
  distance: any []=[];
  userNumber : string;
  current: any []=[];
timer: any []= []
  //distance: any []=[]

  constructor(private appStorage: AppStorageService,
    private cal: CalService, private api: ApiService,
    private background: BackgroundMode,
    //private geolocation: Geolocation,
    private navCtr: NavController,
    private insomnia: Insomnia) { }

  ngOnInit() {
    this.getTripAndUser()
  }
  ionViewWillEnter(){

  }

  getTripAndUser(){
  this.appStorage.getTrip('activeTrip')
  .then((resp)=>{
    this.activeTrip = resp;
    console.log('active ', this.activeTrip)
    this.place = this.activeTrip;
    this.appStorage.getTrip('user')
    .then((resp)=>{
      this.user = resp
    })

  })
  }

  confirm(){
    this.insomnia.keepAwake()
    .then(()=>{
      this.watch = Geolocation.watchPosition({}, (data, err)=>{
        if(err) console.log(err)
        let current = {lat:data.coords.latitude, lng: data.coords.longitude }
        this.addToArray(current);
        //console.log('calculated ',   this.cal.calculateRadius(this.place.coords, current, this.place.fence),' fence ', this.place.fence)
        this.distance.push( this.cal.calculateRadius(this.place.coords, current, this.place.fence))
        this.cal.calculateRadius(this.place.coords, current, this.place.fence) <= this.place.fence ?
        this.callClient(): this.tracking()
  
      
        
      })

    })


  }
  // confirm(){
  //   this.insomnia.keepAwake()
  //   .then(()=>{
  //     this.watch = this.geolocation.watchPosition()
  //     this.watch.subscribe((data)=>{
  //       let current = {lat:data.coords.latitude, lng: data.coords.longitude };
  //       this.addToArray(current);
  //       this.distance.push( this.cal.calculateRadius(this.place.coords, current, this.place.fence))
  //       this.cal.calculateRadius(this.place.coords, current, this.place.fence) <= this.place.fence ?
  //      this.callClient(): this.tracking()
  
  //     })

  //   })


  // }

  addToArray(item){
    if(this.current.length>5){
     // this.current.shift();
      this.current.push(item)
    }else{
      this.current.push(item)
    }
  }
  stop(){
    //console.log('stop called')
  //  this.watch.unsubscribe()
  Geolocation.clearWatch({id:this.watch})
  }
 callClient(){
   let date =  Date.now()
  //  console.log('calling client')
   this.messages.push( "calling client");
   this.timer.push(date)
    this.stop()
    this.userNumber = this.user.countryCode + this.user.phone 
//console.log('calling client ', this.userNumber)
  
    
    // this.api.postResource('call', {'number': this.userNumber} )
    // .subscribe((resp)=>{
    //   this.navCtr.navigateForward('/success')
    //   this.stop()
    // })
  }
  tracking(){
    let date = Date.now()
    console.log('tracking');
    this.messages.push('tracking')
    this.timer.push(date)
  }

}
