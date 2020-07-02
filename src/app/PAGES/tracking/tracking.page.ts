import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/SERVICES/api.service';
import { CalService } from 'src/app/SERVICES/cal.service';
import{} from 'google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { NavController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';


import { Trip } from 'src/app/SHARED/models/trip.model';
const homeGate = {lat:-1.257518, lng: 36.781870}
const mainGate = {lat: -1.258889,  lng: 36.781700 }


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
  ActiveTrip: any;
  messages: any [] = [];
  errors: any []=[];


  @ViewChild('map',{static:false}) mapElement: ElementRef
  markers: any []=[];
  infowindow: google.maps.InfoWindow;
  loading: any;

  constructor(private api: ApiService,private cacl: CalService,
     private geoLocation: Geolocation,
     private backgroundMode: BackgroundMode, 
    private navCtr: NavController,
     private router: Router,
     private appStorage: AppStorageService,
     private loadingController: LoadingController
   
     ) { }

  ngOnInit() {

  }
  ionViewWillEnter(){
    this.getMyLocation()
  }
  getMyLocation(){
    this.geoLocation.getCurrentPosition()
    .then((resp)=>{
      let myOb = {}
      let lat = resp.coords.latitude;
      let lng = resp.coords.longitude;
      myOb = {origin: {lat:lat, lng: lng}}
      this.myLocation = myOb;
      //console.log('got location ', myOb)
      //this.locationsPacket.push(myOb)

      this.initializeMap(lat, lng);

    }).catch((error)=>{
      console.log('error geting location', error)
    })


    
  }
  track(){
    this.backgroundMode.enable()
    let watch = this.geoLocation.watchPosition();
    watch.subscribe((data)=>{

      this.positions.push(this.cacl.tester(data.coords.latitude, data.coords.latitude))
     this.positionLength = this.positions.length
    });

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

  homeGate(){
   this.router.navigate(['/single-tracking', {homeGate}])
  }
  // selectPlace(p){
  //  console.log('selected ', p);
  //  this.presentLoading()
  //   this.service = new google.maps.places.PlacesService(this.map);
  //   //console.log('service ', this.service)
  //   var request = {
  //     placeId: p.place_id,
  //     fields: ['name', 'formatted_address', 'place_id', 'geometry']
  //   };
  //   this.service.getDetails(request,(result, status)=>{
  //     if (status === google.maps.places.PlacesServiceStatus.OK) {
  //       //console.log('location ', result.geometry.location.lat())
  //       let myOb ={}
  //       let myPackage ={};
  //       let lat = result.geometry.location.lat();
  //       let lng = result.geometry.location.lng();
  //       console.log('lat ',lat)
  //       myOb = {lat:lat, lng: lng};
  //       myPackage = {destination:{lat: lat, lng: lng},origin:{lat: this.myLocation.origin.lat, lng: this.myLocation.origin.lng}}
  //       this.api.postResource('trips', myPackage)
  //       .subscribe(resp=>{
  //         //console.log('responce ', resp.body);
  //         this.appStorage.storeTrip('activeTrip', resp)
  //         .then((resp)=>{
  //           this.loading.dismiss()
  //           this.router.navigate(['/single-tracking', {lat: lat, lng:lng, name: result.name}])
  //         })

  //        // console.log(this.appStorage.getTrips('activeTrip'))

  //       })
  //       //console.log('obj ', myOb)

  //     //  this.router.navigate(['/single-tracking', {lat: lat, lng:lng, name: result.name}])
      



  //     }

  //   })

  // }

  selectPlace(p){
   // console.log('selected ',p);
   this.presentLoading()
    let origin = new google.maps.LatLng(this.myLocation.origin.lat, this.myLocation.origin.lng);
    let service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins:[origin],
      destinations:[p.description],
      travelMode: google.maps.TravelMode.DRIVING,
    }, (resp, status)=>{
      if(status == 'OK'){
        this.messages.push('calculating...')
        this.ActiveTrip = resp

          let service = new google.maps.places.PlacesService(this.map);
          let request = {
            placeId: p.place_id,
            fields: ['name', 'formatted_address', 'place_id', 'geometry']
          }
          service.getDetails(request, (result, status)=>{
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              this.messages.push('service get details works')
              let myOb ={}
              let lat = result.geometry.location.lat();
              let lng = result.geometry.location.lng();
              myOb ={coords: {lat, lng}};
              this.ActiveTrip.coords = {lat, lng}
              this.appStorage.storeTrip('activeTrip', this.ActiveTrip)
              .then((resp)=>{
                this.messages.push('saved resp')
               // console.log('resp ', resp);
                 this.loading.dismiss();
                this.navCtr.navigateForward('/single-tracking')
                this.loading.dismiss()
                
              })

            }else{
              this.errors.push('error getting details')
            }

          })


   
      }else{
        //error getting distance matrix
        this.errors.push('errors getting distance matrix')
      }

    })
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
      message: 'Please wait...'
      // duration: 2000
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
    //.log('Loading dismissed!');
  }

}
