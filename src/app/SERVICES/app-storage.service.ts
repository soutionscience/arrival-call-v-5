import { Injectable } from '@angular/core';
//import { Storage } from '@ionic/storage';
import { Trip } from '../SHARED/models/trip.model';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;



@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  trip: Trip

  constructor() { }
  async storeTrip(key, obj){
    let o= JSON.parse( obj.body);
    let trip: Trip;
    trip= {origin: {name: o.origin_addresses[0]},
    destination:{name: o.destination_addresses[0] },
    tripDuration: o.rows[0].elements[0].duration.text,
    tripDurationSec:o.rows[0].elements[0].duration.value
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
