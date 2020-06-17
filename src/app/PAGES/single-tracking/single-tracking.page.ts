import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CalService } from 'src/app/SERVICES/cal.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';
import { Trip } from 'src/app/SHARED/models/trip.model';
const mainGate = {lat: -1.258889,  lng: 36.781700 }
const grMathenge ={lat:-1.253677, lng:36.799868}
const embu = {lat:-0.533461, lng:37.450854}

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

  constructor(private navParams: NavParams, 
    private route: ActivatedRoute, 
    private calc: CalService,
    private geoLocation: Geolocation,
    private backgroundMode: BackgroundMode,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private appStorage: AppStorageService) {
    //console.log(this.navParams.data.homeGate)
    //this.place = this.navParams.data.
    this.getDetails()
   }
   
  ngOnInit() {
    this.createForm()
  }

  ionViewWillEnter(){
    this.createForm();
    this.getTripDetails();

  }
  getTripDetails(){
    this.appStorage.getTrips('activeTrip')
    .then((resp)=>{
      this.activeTrip = resp;
      this.maxTripDuration = Math.floor(this.activeTrip.tripDuration.value/60)
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

   startTracking(){
   // this.backgroundMode.enable()
    this. watch = this.geoLocation.watchPosition({ enableHighAccuracy: true });
    this.watch.subscribe((data)=>{
      let current = {lat:data.coords.latitude, lng: data.coords.longitude };
   
   this.distance.push(this.calc.calculateRadius(this.place, current, this.rangeForm.value.minRange))
   this.calc.calculateRadius(this.place, current, this.rangeForm.value.minRange) <= 
   this.rangeForm.value.minRange ? this.navCtrl.navigateForward('/success'): this.message ='still tracking'
   
      console.log('test ', this.calc.calculateRadius(this.place, current, this.rangeForm.value.minRange) )
     this.positionLength = this.positions.length
    });


   }
   stopWatch(){
   //  this.geoLocation.clearWatch(this.watch)
   }
   back(){
     this.place ='';
     this.navCtrl.navigateBack('tracking')
   }
   
  


}
