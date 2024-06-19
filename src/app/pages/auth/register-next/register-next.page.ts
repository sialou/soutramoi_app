import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { capitalize } from 'src/app/helpers';
import { locations } from 'src/app/helpers/locations';
import { AlertService } from 'src/app/services/alert.service';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { StorageService } from 'src/app/services/storage.service';

interface TmpUser {
  name: string;
  phone: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register-next',
  templateUrl: './register-next.page.html',
  styleUrls: ['./register-next.page.scss'],
})
export class RegisterNextPage {
  @ViewChild('modalEnd') modal: IonModal;

  form: FormGroup;
  payload: TmpUser;

  cityOptions: { name: string; value: string }[] = [];
  townOptions: { name: string; value: string }[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private app: AppService,
    private auth: AuthService,
    private alert: AlertService,
    private loader: LoaderService,
    private storage: StorageService,
  ) {
    Object.keys(locations).forEach(value => {
      this.cityOptions.push({ name: capitalize(value).trim(), value: value.trim().toLowerCase() });
    });

    this.form = new FormGroup({
      city: new FormControl(null, [
        Validators.required,
      ]),
      town: new FormControl(null, [
        Validators.required,
      ]),
    });
  }

  ionViewDidEnter() {
    const sub = this.form.controls.city.valueChanges.subscribe((value: string) => {
      this.townOptions = value ? locations[`${value}`] : [];
    });

    this.subscriptions.push(sub);
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async onSubmit() {
    if (!this.form.controls.city.valid) {
      this.alert.present('Veuillez choisir une ville.');
      return;
    }

    if (!this.form.controls.town.valid) {
      this.alert.present('Veuillez choisir une commune.');
      return;
    }

    await this.loader.present('Inscription...');

    const cityId: string = this.form.value.city;
    const townId: string = this.form.value.town;
    const { name, email, phone, password } = (await this.storage.get('soutramoi_tmp_register') as TmpUser);
    const anonym = this.auth.currentUser();
    const anonymUid = anonym ? anonym.uid : null;

    const payload: any = {
      email,
      phone,
      password,
      name,
      cityId,
      townId,
    };

    if (anonymUid) {
      payload.anonymUid = anonymUid;
    }

    this.auth
      .register(payload).then(async user => {
        await this.auth.setUser(user);
        await this.loader.dismiss();
        await this.router.navigate(['/tabs/profile']);
      })
      .catch(err => this.app.handlingError(err))
      .finally(() => {
        this.storage.remove('soutramoi_tmp_register');
      });
  }

  async presentModal() {
    await this.modal.present();
  }

  async dismissModal() {
    await this.modal.dismiss();
  }
}
