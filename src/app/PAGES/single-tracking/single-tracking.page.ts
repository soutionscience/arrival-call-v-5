import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CalService } from 'src/app/SERVICES/cal.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';
import { Trip } from 'src/app/SHARED/models/trip.model';
import { ApiService } from 'src/app/SERVICES/api.service';
import{} from 'google-maps';

@Component({
  selector: 'app-single-tracking',
  templateUrl: './single-tracking.page.html',
  styleUrls: ['./single-tracking.page.scss'],
})
export class SingleTrackingPage implements OnInit {
  place: any;
  positions: any [] = [];
  positionLength: number;
  watch: any
  rangeForm: FormGroup;
  message:  string ='';
  distance: any [] =[];
  activeTrip: Trip;
  maxTripDuration: number //add hours and stuff
  fence:number;
  loading: any
  map: any

  constructor(private navParams: NavParams, 
    private route: ActivatedRoute, 
    private calc: CalService,
    private geoLocation: Geolocation,
    private backgroundMode: BackgroundMode,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private appStorage: AppStorageService,
    private api: ApiService,
    private loadingController: LoadingController) {

   }
   
  ngOnInit() {
    this.createForm()
  }

  ionViewWillEnter(){
    this.createForm();
   this.getTripDetails();

  }
  getTripDetails(){
    this.appStorage.getTrip('activeTrip')
    .then((resp)=>{
      this.activeTrip = resp;
      this.place = this.activeTrip;
      console.log('trip ', this.activeTrip)
      this.maxTripDuration = Math.floor(this.activeTrip.tripDuration.value/60) +1
    })
  }
  createForm(){
    this.rangeForm = this.fb.group({
      minRange:[2,[Validators.required]]
    })
  }

   getDetails(){
     this.route.params.subscribe((resp)=>{
     this.place = resp
    console.log(this.place.name, 'lat ', this.place)})
   }

  //  startTracking(){
  //   this.watch = '';
  //   //testing fence approximation
  //   this.fence = this.calc.setFence(this.activeTrip, this.rangeForm.value.minRange)
  //   this.backgroundMode.enable()
  //   this. watch = this.geoLocation.watchPosition({ enableHighAccuracy: true });
  //   this.watch.subscribe((data)=>{
  //     let current = {lat:data.coords.latitude, lng: data.coords.longitude };
   
  //  this.distance.push(this.calc.calculateRadius(this.place, current, this.fence))
   
  //  this.calc.calculateRadius(this.place, current, this.fence) <= this.fence? this.callClient(): this.message ='still tracking'
   
  //     console.log('test ', this.calc.calculateRadius(this.place, current, this.rangeForm.value.minRange) )
  //    this.positionLength = this.positions.length
  //   });


  //  }


  startTracking(){
    this.presentLoading()
    this.fence = this.calc.setFence(this.activeTrip, this.rangeForm.value.minRange)
   // this.activeTrip.fence = this.fence;
    this.appStorage.addFence('activeTrip', this.activeTrip, this.fence, this.rangeForm.value.minRange )
    .then((resp)=>{
      //this.loadingController.dismiss()
      this.navCtrl.navigateForward('/confirm')
      
    })
  }

   back(){
     this.place ='';
     this.navCtrl.navigateBack('tracking')
   }


   async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 500
    });
    return await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
    //.log('Loading dismissed!');
  }
  


}
