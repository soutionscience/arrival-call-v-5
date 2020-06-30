import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/SERVICES/api.service';
import { country } from 'src/app/SHARED/models/country.model';
import { AppStorageService } from 'src/app/SERVICES/app-storage.service';
import { User } from 'src/app/SHARED/models/user.model';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  regForm: FormGroup;
  confirmForm: FormGroup;
  unsavedCountries: country []
  countries: country [];
  showRegistration: Boolean = true;
  showConfirmation: Boolean = false;
  user:User;
  loading:any;

  constructor(private fb: FormBuilder, private api: ApiService, 
    private appStorage: AppStorageService,
    private loadingController: LoadingController,
    private navCtr: NavController) { }

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
    this.confirmForm = this.fb.group(
      {code: ['', [Validators.required]]}
      
    )
  }

  getCountries(){
    this.appStorage.getTrip('countries')
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
    this.presentLoading()
    //console.log('submit', this.regForm.value)
    this.api.postResource('users', this.regForm.value)
    .subscribe(resp=> {
      this.user = resp;
      this.appStorage.storeUser('user', this.user).then((resp)=>{
        this.showRegistration = false;
        this.showConfirmation = true;
        this.loading.dismiss()

      })
    
  
    })
  }

  confirm(){
    //console.log('confirm ', this.user._id, 'code ', this.confirmForm.value)
    this.presentLoading()

this.api.postSpecificResource('users', this.user._id, 'verify',this.confirmForm.value)
.subscribe(resp=>{
  this.user = resp;
  this.appStorage.storeUser('user',this.user).then((resp)=>{
    this.navCtr.navigateForward('/confirm')
    this.loading.dismiss()
  })
 
})
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
