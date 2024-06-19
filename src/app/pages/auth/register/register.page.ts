import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { matchValidator } from 'src/app/helpers';
import { AlertService } from 'src/app/services/alert.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  form: FormGroup;

  constructor(
    private router: Router,
    private alert: AlertService,
    private storage: StorageService,
  ) {
    this.form = new FormGroup(
      {
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^[\p{L}\'][ \p{L}\'-]*[\p{L}]$/),
        ]),
        username: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$|^[0-9]{10}$/),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
        passwordConfirm: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: [
          matchValidator(['password', 'passwordConfirm']),
        ],
      }
    );
  }

  async onSubmit() {
    if (!this.form.controls.name.valid) {
      this.alert.present('Votre nom n\'est pas valide, veuilez entrer votre nom complet. (ex: "Marc Antoine")');
      return;
    }

    if (!this.form.controls.username.valid) {
      this.alert.present('Veuillez entrer une adresse email ou un numéro de téléphone valide.');
      return;
    }

    if (this.form.errors && this.form.errors.match) {
      this.alert.present('Les mots de passe ne correspondent pas.');
      return;
    }

    const name: string = this.form.value.name;
    const username: string = this.form.value.username;
    const password: string = this.form.value.password;

    let email = username;
    let phone = null;

    if (username.match(/^[0-9]{10}$/)) {
      phone = username;
      email = `${username}@soutramoi.com`;
    }

    await this.storage.set('soutramoi_tmp_register', { name, email, phone, password });
    await this.router.navigate(['/auth/register-next']);
  }
}
