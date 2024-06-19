import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  //type='password';
  //iconName="eye-outline";
  type: boolean=true;
  isLogin= false;

  userInput = {
    type: 'email',
    placeholder: 'Adresse email',
  };

  constructor(
    private router: Router,
    private app: AppService,
    private loader: LoaderService,
    private auth: AuthService,
  ) {
    this.form = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$|^[0-9]{10}$/),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit() { }

  

  changeType(){
    this.type=!this.type;
   /* if (this.iconName=='eye-outline'){
      this.type="text";
      this.iconName='eye-off-outline';

    }else{
      this.type="password";
      this.iconName='eye-outline';
    }*/
  }

  onSubmit(form:NgForm) {
    console.log(form);
    if(!form.valid) return;
    this.login(form);
  }

  login(form){

    this.isLogin=true;
  }

  /*async onSubmit() {
    if (!this.form.valid) {
      return;
    }

    await this.loader.present('Connexion...');

    const username: string = this.form.value.username;
    const password: string = this.form.value.password;
    let email = username;
    let phone = null;

    if (username.match(/^[0-9]{10}$/)) {
      phone = username;
      email = `${username}@soutramoi.com`;
    }

    this.auth.login({ email, phone, password }).then(
      async user => {
        await this.auth.setUser(user);
        await this.loader.dismiss();
        await this.router.navigate(['/tabs/profile']);
      },
      err => this.app.handlingError(err),
    );
  }*/
}
