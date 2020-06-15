import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/SERVICES/api.service';
import { CalService } from 'src/app/SERVICES/cal.service';
import{} from 'google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
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


  @ViewChild('map',{static:false}) mapElement: ElementRef
  markers: any []=[];
  infowindow: google.maps.InfoWindow;

  constructor(private api: ApiService,private cacl: CalService,
     private geoLocation: Geolocation,
     private backgroundMode: BackgroundMode, 
    //  private navCtr: NavController,
     private router: Router
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
    this.service = new google.maps.places.AutocompleteService();
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
  selectPlace(p){
   console.log('selected ', p)
    this.service = new google.maps.places.PlacesService(this.map);
    //console.log('service ', this.service)
    var request = {
      placeId: p.place_id,
      fields: ['name', 'formatted_address', 'place_id', 'geometry']
    };
    this.service.getDetails(request,(result, status)=>{
      if (status === google.maps.places.PlacesServiceStatus.OK) {
       // console.log('location ', result.geometry.location.lat())
        let myOb ={}
        let lat = result.geometry.location.lat();
        let lng = result.geometry.location.lng();
        console.log('lat ',lat)
        myOb = {lat:lat, lng: lng};
        console.log('obj ', myOb)

        this.router.navigate(['/single-tracking', {lat: lat, lng:lng, name: result.name}])
      



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

}
