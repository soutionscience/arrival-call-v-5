import { Injectable } from '@angular/core';
//import { Storage } from '@ionic/storage';
import { Trip } from '../SHARED/models/trip.model';
import { Plugins } from '@capacitor/core';
import { async } from '@angular/core/testing';
const { Storage } = Plugins;



@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  trip: Trip

  constructor() { }
  storeTrip= async (key, obj)=>{
    console.log('obj ', obj)
    let o= obj
    let trip: Trip;
    trip= {origin: {name: o.originAddresses[0]},
    destination:{name: o.destinationAddresses[0] },
    tripDuration: {text: o.rows[0].elements[0].duration.text, value:o.rows[0].elements[0].duration.value },
    tripDurationSec:o.rows[0].elements[0].duration.value,
    distance:{text:o.rows[0].elements[0].distance.text, value: o.rows[0].elements[0].distance.value}
  }
  this.trip =trip
  await Storage.set({key: key, value: JSON.stringify(this.trip)});
  return this.trip;

}
async getTrips(key){
  let trips = await Storage.get({key: key});
  return JSON.parse(trips.value)

}


}
