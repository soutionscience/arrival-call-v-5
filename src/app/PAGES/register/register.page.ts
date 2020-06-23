import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/SERVICES/api.service';
import { country } from 'src/app/SHARED/models/country.model';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  regForm: FormGroup;
  unsavedCountries: country []
  countries: country []

  constructor(private fb: FormBuilder, private api: ApiService, private appStorage: AppStorageService) { }

  ngOnInit() {
    this.createForm()
   this.getCountries()
  }
  ionViewWillEnter(){
    this.createForm();
    

  }
  createForm(){
    this.regForm = this.fb.group(
      {countryCode: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]]},
    )
  }

  getCountries(){
    this.appStorage.getTrips('countries')
    .then((resp)=>{
      if(resp) return this.countries = resp;
      if(resp == null){
        this.api.getResource('countries/active')
        .subscribe((resp)=>{
          this.unsavedCountries = resp;
          this.appStorage.storeCountry('countries', this.unsavedCountries)
          .then((resp)=> this.getCountries())
         
        })
      }
    })

  }
  submit(){
    console.log('submit', this.regForm.value)
    this.api.postResource('users', this.regForm.value)
    .subscribe(resp=> console.log('resp ', resp))
  }

}
