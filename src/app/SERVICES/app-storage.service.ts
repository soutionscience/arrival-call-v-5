import { Injectable } from '@angular/core';
//import { Storage } from '@ionic/storage';
import { Trip } from '../SHARED/models/trip.model';
import { Plugins } from '@capacitor/core';
import { async } from '@angular/core/testing';
import { country } from '../SHARED/models/country.model';
import { User } from '../SHARED/models/user.model';
const { Storage } = Plugins;



@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  trip: Trip
  countries: country [];
  user: User

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
async getTrip(key){
  let trip = await Storage.get({key: key});
  return JSON.parse(trip.value)

}
// add fence
addFence = async(key, trip: Trip, fence, fenceTime)=>{
  //console.log('fence ', fence);
  this.trip = trip;
  this.trip.fence = fence;
  this.trip.fenceTime = fenceTime
  await Storage.set({key: key, value: JSON.stringify(this.trip)});
  return this.trip;

}


///country storage stuff


storeCountry = async(key, obj:country [])=>{
  this.countries =obj
  await Storage.set({key: key, value: JSON.stringify(this.countries)});

}

storeUser = async(key, user: User)=>{
  this.user = user;
  await Storage.set({key: key, value: JSON.stringify(this.user)})

}

//check if user is active
isVerified = async()=>{
  let user = await  Storage.get({key:'user'})
 // console.log('user ', user)
  if(user.value == null){
    return false;

  }else{
    let verified = JSON.parse(user.value)
    return verified.verified

    
  }

}
tripIsActive = async()=>{
  let trip = await Storage.get({key:'activeTrip'})
  if(trip.value == null){
    return false;
  }else{
    return true;
  }
}


}
