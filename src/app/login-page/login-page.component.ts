import { Input, Component, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../core/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  hide = true;
  error = '';

  constructor(
    private autService: AuthService
  ) { 
    //TODO: redirect the user to the dashboard if loggedin and toast to let them know that they are loggedin
  }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    let values = this.loginForm.value
    if (values.email == ''){
      this.error = 'Please enter an email'
    }else if (values.password == ''){
      this.error = 'Please enter a password'
    }

    this.autService.emailPasswordSignin(values.email, values.password)
  }

  

}
