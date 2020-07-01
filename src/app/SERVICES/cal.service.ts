import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trip } from '../SHARED/models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class CalService {

  constructor() { }

  calculateRadius(coords1, coords2, fence){
    console.log('called ', coords1, ' 2 ', coords2)
   const toRad=(x)=>{
      return  x* Math.PI/180;
    }

    let lat1 = coords1.lat;
    let lng1 = coords1.lng;
    let lat2 = coords2.lat;
    let lng2 = coords2.lng;


    var R = 6371 //km radius of earth
    let x1 = lat2- lat1;
    let dLat = toRad(x1);
    let x2 = lng2 - lng1;
    let dLong = toRad(x2);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
           Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))*
           Math.sin(dLong/2) * Math.sin(dLong/2);
     let c  = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     let d = R*c;
    // console.log('what is d ', d)
   //return d<=fence? true: false
  // console.log('d ', d, 'and fence is ', fence)
     return d;


    }
    tester(coords1, coord2){
      console.log('called')
      let obj = {coords1, coord2}
     return obj
    }


    setFence(trip: Trip, time){
      let estimatedSpeed = trip.distance.value/(trip.tripDuration.value/60);
      let actualFence = estimatedSpeed * time;
      return (actualFence/1000) + 2
    }
}
