import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Subscription } from 'rxjs';

import { fadeTransition, pageTransition } from 'src/app/animations';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NetworkService, NetworkState } from 'src/app/services/network.service';

import { SwitchComponent } from 'src/app/shared/switch/switch.component';
import { ProfileCardItemComponent } from './components/profile-card-item.component';
import { TabsService } from 'src/app/services/tabs.service';

@Component({
  selector: 'tab-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  animations: [fadeTransition, pageTransition],
})
export class ProfilePage {
  @ViewChildren(ProfileCardItemComponent) cardItems!: QueryList<ProfileCardItemComponent>;
  @ViewChild(SwitchComponent) genderSwitch: SwitchComponent;

  subscribeModal = false;
  state = new BehaviorSubject<PageState>('loading');
  defaultFailMessage = 'Une erreur est survenue lors de la récupération des données.';
  failMessage = this.defaultFailMessage;

  user: User = null;
  locations: AppLocation[] = [];
  cityOptions: AppLocation[] = [];
  townOptions: AppLocation[] = [];

  form: {
    name: FormControl;
    email: FormControl;
    phone: FormControl;
    city: FormControl;
    town: FormControl;
    gender: FormControl;
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private app: AppService,
    private alert: AlertService,
    private loader: LoaderService,
    private auth: AuthService,
    private http: HttpService,
    private network: NetworkService,
    private tabs: TabsService,
  ) {
    this.form = {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl(null, [
        Validators.pattern(/^[0-9]{10}$/),
      ]),
      city: new FormControl(null, [
        Validators.required,
      ]),
      town: new FormControl(null, [
        Validators.required,
      ]),
      gender: new FormControl(null, [
        Validators.required,
      ]),
    };
  }

  ionViewDidEnter() {
    this.initialize();

    this.state.next('loading');

    if (this.network.is('online')) {
      this.loadData();
    } else {
      this.state.next('offline');

      const sub = this.network.listen().subscribe(state => {
        if (state === NetworkState.on) {
          this.loadData();
          sub.unsubscribe();
        }
      });

      this.subscriptions.push(sub);
    }
  }

  ionViewDidLeave() {
    this.subscriptions.forEach(i => i.unsubscribe());
  }

  initialize() {
    const sub = this.state.asObservable().subscribe(state => {
      if (state === 'ready' && !this.user.city) {
        this.alert.present({
          title: 'Profil incomplet',
          text: 'Veuillez renseigner votre ville et votre quartier.',
          confirmButtonText: 'Renseigner',
        }).then(result => {
          if (result.isConfirmed) {
            const element = document.querySelector('#locations-anchor');

            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
          }
        });
      }
    });

    this.subscriptions.push(sub);
  }

  photoChange(user: User) {
    this.user = user;
    this.auth.setUser(user);
  }

  genderChange(gender: Gender) {
    this.alert.present({
      text: 'Vous confirmez la modification ?',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Modifier'
    }).then(result => {
      if (result.isConfirmed) {
        this.loader.present('Mofication en cours...');

        const { id_token } = this.user;
        const sub = from(this.http.post('/me/profile', { gender, id_token })).subscribe({
          next: (user: User) => {
            this.form.gender.setValue(user.gender);
            this.user.gender = user.gender;
            this.auth.setUser(user);
            this.loader.dismiss();
          },
          error: (err) => {
            this.app.handlingError(err);
            this.genderSwitch.restore();
          }
        });

        this.subscriptions.push(sub);
      } else {
        this.genderSwitch.restore();
      }
    });
  }

  passwordChange(user: User) {
    this.user = user;
    this.auth.setUser(user);
  }

  valueChange(slug: string, value: any) {
    const field = this.cardItems.find(i => i.slug === slug);

    field.state.next('loading');

    const sub = from(this.submit(slug, value)).subscribe({
      next: () => {
        this.sync(slug, value);
        field.done(value);
        setTimeout(() => field.state.next('initial'), 1500);
      },
      error: (err) => {
        field.state.next('error');
        field.input.setValue(field.value);
        this.app.handlingError(err);
        setTimeout(() => field.state.next('initial'), 1500);
      }
    });

    this.subscriptions.push(sub);
  }

  async submit(name: string, value: any) {
    const { id_token } = await this.auth.getUser();
    const body: any = { id_token };

    if (['name', 'town', 'city'].includes(name)) {
      if (name === 'name') {
        body.name = value;
      } else if (name === 'city') {
        const towns = this.locations.filter(i => i.parent_id === value);

        body.town_id = towns.length > 0 ? towns[0].id : value;
        body.city_id = value;
      } else if (name === 'town') {
        body.town_id = value;
      }

      return this.http.post('/me/profile', body);
    } else if (name === 'phone') {
      body.phone = String(value).trim();
      return this.http.post('/me/phone', body);
    } else if (name === 'email') {
      body.email = String(value).trim().toLowerCase();
      return this.http.post('/me/email', body);
    }
  }

  sync(name: string, value: any) {
    const user: User = { ...this.user };

    if (['town', 'city'].includes(name)) {
      value = Number(value);

      if (name === 'city') {
        user.city = this.cityOptions.find(i => i.id === value);
        this.townOptions = this.locations.filter(i => i.parent_id === value);

        if (this.townOptions.length === 0) {
          this.townOptions = [user.city];
          user.town = user.city;
        } else {
          user.town = this.townOptions[0];
        }

        this.form.town.setValue(user.town.id);
      } else {
        user.town = this.locations.find(i => i.id === value);
      }
    } else if (name === 'email') {
      user.email = String(value).trim().toLowerCase();
    } else {
      user[name] = String(value).trim();
    }

    this.user = user;
    this.auth.setUser(this.user);
  }

  logout() {
    this.alert.present({
      title: 'Déconnexion',
      text: 'Voulez-vous vraiment vous déconnecter ?',
      confirmButtonText: 'Se déconnecter',
      cancelButtonText: 'Annuler',
      showCancelButton: true,
    }).then(async res => {
      if (res.isConfirmed) {
        await this.auth.logout();
        await this.router.navigate(['/tabs/home']);
      }
    });
  }

  reload() {
    this.state.next('loading');
    this.loadData();
  }

  promptSubscribe() {
    this.tabs.dissmiss();
    this.subscribeModal = true;
  }

  confirmSubscribe() {
    this.subscribeModal = false;
    this.tabs.present();

    setTimeout(() => this.router.navigate(['/profile/pro']), 300);
  }

  cancelSubscribe() {
    this.subscribeModal = false;
    this.tabs.present();
  }

  locationsToSelectOptions(items: AppLocation[]) {
    const stack = items.map(i => ({ name: i.name, value: i.id }));
    return stack.sort((a: any, b: any) => a.name - b.name);
  }

  private async loadData() {
    const request = await this.auth.me();
    const sub = request.subscribe({
      next: (user: User) => {
        this.auth.setUser(user);
        this.user = user;
        this.loadLoacations();
      },
      error: (err) => {
        this.failMessage = this.app.handlingError(err, false);
        this.state.next('failed');
      }
    });

    this.subscriptions.push(sub);
  }

  private loadLoacations() {
    const sub = from(this.http.get('/locations')).subscribe({
      next: (locations: AppLocation[]) => {
        if (this.user.city) {
          const { city } = this.user;
          const towns = [...locations].filter(i => i.parent_id === city.id);
          this.townOptions = towns.length > 0 ? towns : [city];
        } else {
          this.townOptions = [];
        }

        this.cityOptions = [...locations].filter(i => i.parent_id === null);
        this.locations = locations;
        this.state.next('ready');
      },
      error: (err) => {
        this.failMessage = this.app.handlingError(err, false);
        this.state.next('failed');
      }
    });

    this.subscriptions.push(sub);
  }
}
