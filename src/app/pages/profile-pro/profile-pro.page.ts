import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, from, Subscription } from 'rxjs';

import { DEFAULT_GEO_LOCATION } from 'src/app/helpers';
import { AlertService } from 'src/app/services/alert.service';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-profile-pro',
  templateUrl: './profile-pro.page.html',
  styleUrls: ['./profile-pro.page.scss'],
})
export class ProfileProPage implements OnInit {
  form: FormGroup;
  products: string[] = [];
  services: string[] = [];
  geoLocation: number[];

  user: User = null;
  defaultGeoLocation = DEFAULT_GEO_LOCATION;
  state = new BehaviorSubject<PageState>('loading');

  payload: ProfessionalData = {
    job_id: null,
    address: null,
    company_name: null,
    description: null,
    geolocation: null,
    services: [],
    products: [],
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private app: AppService,
    private alert: AlertService,
    private auth: AuthService,
    private http: HttpService,
    private loader: LoaderService,
    private network: NetworkService,
  ) {
    this.form = new FormGroup({
      job: new FormControl(''),
      address: new FormControl(''),
      companyName: new FormControl(''),
      description: new FormControl(''),
    });
  }

  async ngOnInit() { }

  async ionViewDidEnter() {
    await this.initialize();
  }

  ionViewDidLeave() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  picturechange(user: User) {
    this.user = user;
    this.auth.setUser(user);
  }

  valueChange(slug: string, value: any) {
    if (slug === 'job') {
      this.form.controls.job.setValue(value);
    } else if (slug === 'address') {
      this.form.controls.address.setValue(value);
    } else if (slug === 'company') {
      this.form.controls.companyName.setValue(value);
    } else if (slug === 'description') {
      this.form.controls.description.setValue(value);
    } else if (slug === 'products') {
      this.products = value;
    } else if (slug === 'services') {
      console.log(value);
      this.services = value;
    } else if (slug === 'geolocation') {
      this.geoLocation = value;
    }
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    if (this.products.length === 0) {
      this.alert.present('Veuillez choisir au moins un produit.');
      return;
    }

    if (this.services.length === 0) {
      this.alert.present('Veuillez choisir au moins un service.');
      return;
    }

    if (!this.geoLocation || this.geoLocation.length !== 2) {
      this.alert.present('Veuillez définir votre localisation.');
      return;
    }

    const coords = this.geoLocation.join('@');

    if (!coords.match(/^(-?\d+(\.\d+)?)@\s*(-?\d+(\.\d+)?)$/g)) {
      this.alert.present('Veuillez définir votre localisation exacte.');
      return;
    }

    const body = {
      ...this.form.value,
      products: this.products,
      services: this.services,
      geolocation: coords,
    };

    console.log(body);

    if (this.network.is('offline')) {
      this.alert.present('Veuillez vérifier votre connexion internet.');
      return;
    }

    // this.loader.present('Mise à jour en cours...');

    // const sub = from(this.http.post('/profile/prefessional', body)).subscribe({
    //   next: (user: User) => {
    //     this.loader.dismiss();
    //     this.alert.present('Votre profil a été mis à jour.');
    //     this.auth.setUser(user);
    //   },
    //   error: (err) => this.app.handlingError(err),
    // });

    // this.subscriptions.push(sub);
  }

  private async initialize() {
    this.user = await this.auth.getUser();

    if (this.user.professional) {
      this.payload = this.user.professional;
    }

    this.state.next('ready');
  }
}
