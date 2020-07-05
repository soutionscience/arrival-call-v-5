import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/SERVICES/api.service';
import { CalService } from 'src/app/SERVICES/cal.service';
import{} from 'google-maps';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { NavController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';
import { Trip } from 'src/app/SHARED/models/trip.model';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;


@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})


export class TrackingPage implements OnInit {
  positions: any []= [];
  positionLength:number =0;
  service: any;
  places: any []=[];
  map: any;
  myLocation: any;
  activeTrip: any;
  messages: any [] = [];
  errors: any []=[];


  @ViewChild('map',{static:false}) mapElement: ElementRef
  markers: any []=[];
  infowindow: google.maps.InfoWindow;
  loading: any;

  constructor(private api: ApiService,private cacl: CalService,
    //  private geoLocation: Geolocation,
     private backgroundMode: BackgroundMode, 
    private navCtr: NavController,
     private router: Router,
     private appStorage: AppStorageService,
     private loadingController: LoadingController
   
     ) { }

  ngOnInit() {
   // this.getMyLocation()
   this.getCurrentLocation();
  

  }
  ionViewWillEnter(){
    this.getCurrentLocation()
  }
  getCurrentLocation(){
    this.messages.push('get myLocation called')
    this.getCurrentPosition().then((resp)=>{
        let myOb = {}
      let lat = resp.coords.latitude;
      let lng = resp.coords.longitude;
      this.initializeMap(lat, lng)
      myOb = {origin: {lat:lat, lng: lng}}
      this.myLocation = myOb;
      this.messages.push(this.myLocation.origin.lat)
    }).catch((error)=>{
      console.log('error getting location')
      this.errors.push(error)
    })

  }
  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates
  }




  search(p){
    !p? this.reset():
    this.service = new google.maps.places.AutocompleteService() // check if you can filter
    this.service.getQueryPredictions({input: p}, (results, status)=>{
      if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.places = results;
          //console.log(this.places[0])
        }else{
          console.log('error getting request')
        }
      })

  }
  reset(){

  }




  selectPlace(p){
    this.presentLoading() 
     this.messages.push(p.description)
    let origin = new google.maps.LatLng(this.myLocation.origin.lat, this.myLocation.origin.lng);
    this.messages.push('lat:  ' + this.myLocation.origin.lat);
    this.messages.push('lng:  ' + this.myLocation.origin.lng)
    this.messages.push('origin: ', origin)
 let service = new google.maps.DistanceMatrixService();
 this.messages.push(service)
    service.getDistanceMatrix({
      origins:[origin],
      destinations:[p.description],
      travelMode: google.maps.TravelMode.DRIVING,
    }, (resp, status)=>{
      if(status == 'OK'){
        //this.messages.push('distance matrix worked')
        this.activeTrip = resp;
        this.getCoords(p)
      
      //  this.navCtr.navigateForward('/single-tracking');
      //  this.loading.dismiss();

    
         
   
      }else{
        //error getting distance matrix
       this.errors.push('errors getting distance matrix')
      }

    })
  }

  selectPlace2(p){
    this.presentLoading();
    this.messages.push('select 2');
    this.navCtr.navigateForward('/single-tracking');
    this.loading.dismiss();


  }
  initializeMap(lat, lng){
    // console.log('initialize')
     let userLocation  = new google.maps.LatLng(lat, lng);
     this.infowindow = new google.maps.InfoWindow();
 
     this.map = new google.maps.Map(
       this.mapElement.nativeElement,
       {center: userLocation, zoom: 15}
     );
     let marker = new google.maps.Marker({
       position: userLocation,
       map: this.map,
       title: 'You'
   
     })
     this.markers.push(marker)
     this.service = new google.maps.places.PlacesService(this.map)
   }


   async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 0
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  getCoords(p){
    let service = new google.maps.places.PlacesService(this.map);
    let request = {
      placeId: p.place_id,
      fields: ['name', 'formatted_address', 'place_id', 'geometry']
    }
     service.getDetails(request, (result, status)=>{
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              //this.messages.push('service get details works')
              let myOb ={}
              let lat = result.geometry.location.lat();
              let lng = result.geometry.location.lng();
              myOb ={coords: {lat, lng}};
              this.activeTrip.coords = {lat, lng}
              this.appStorage.storeTrip('activeTrip', this.activeTrip)
              .then((resp)=>{
                this.navCtr.navigateForward('/single-tracking');
                this.loading.dismiss();
              })

            }else{
              return "error"
            }

          })


  }



}
