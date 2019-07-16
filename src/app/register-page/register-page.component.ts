import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  hide = true;
  error = '';

  constructor() { }

  ngOnInit(){

  }

  signupForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    let values = this.signupForm.value
    if (values.email == ''){
      this.error = 'Please enter an email'
    } else if (values.password == ''){
      this.error = 'Please enter a password'
    }

    console.log(values)

  }

}
