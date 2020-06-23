import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  regForm: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm()
  }
  ionViewWillEnter(){
    this.createForm()

  }
  createForm(){
    this.regForm = this.fb.group(
      {countryCode: ['', [Validators.required]],
      number: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]]},
    )
  }

}
