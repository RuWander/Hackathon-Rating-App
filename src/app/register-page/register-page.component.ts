import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  hide = true;
  error = '';

  constructor(private auth: AuthService) {}

  signupForm = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    password: new FormControl('')
  });

  ngOnInit() {}

  onSubmit() {
    const values = this.signupForm.value;
    if (values.email === '') {
      this.error = 'Please enter an email';
    } else if (values.password === '') {
      this.error = 'Please enter a password';
    }

    this.auth.register(values);

    console.log(values);
  }
}
