import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';
import { FormControl } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Geolocation } from '@capacitor/geolocation';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';

import { AlertService } from 'src/app/services/alert.service';
import { fadeTransition } from 'src/app/animations';
import { DEFAULT_GEO_LOCATION } from 'src/app/helpers';

@Component({
  selector: 'profile-pro-map',
  styleUrls: ['./profile-pro-map.component.scss'],
  animations: [fadeTransition],
  template: `
    <app-input floatLabel>
      <input type="text" id="address" placeholder="Entrez votre adresse" [formControl]="addressForm" required>
      <label for="address">Adresse</label>
    </app-input>
    <h4 class="map-title">Localisation sur la carte</h4>
    <div class="map-viewport">
      <mgl-map
        [style]="'mapbox://styles/mapbox/streets-v11'"
        [center]="center"
        [zoom]="[13]"
        [maxZoom]="18"
        [minZoom]="6"
        (mapLoad)="ready($event)"
        (moveEnd)="changeLocation($event)"
      ></mgl-map>

      <img src="assets/img/center-pin.png" class="map-pin" alt="" *ngIf="init">

      <div class="map-overlay" @FadeTransition *ngIf="!init">
        <button type="button" class="save" (click)="initialize()">
          <ion-icon src="assets/icons/pin.svg"></ion-icon> Definir
        </button>
      </div>
    </div>
    <p class="map-description">Cliquez et faites glisser pour repositionner.</p>
  `,
})
export class ProfileProMapComponent implements OnInit, OnDestroy {
  @Output() valueChange = new EventEmitter<any[]>();
  @Input() payload: ProfessionalData;

  center: LngLatLike = DEFAULT_GEO_LOCATION;
  addressForm = new FormControl('');
  hasPermission = false;
  init = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private platform: Platform,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.addressForm.setValue(this.payload.address);
    this.center = this.payload.geolocation || DEFAULT_GEO_LOCATION;

    this.subscriptions.push(
      this.addressForm.valueChanges.subscribe(v => this.valueChange.emit(['address', v]))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ready(map: Map) {
    map.resize();
  }

  changeLocation(event) {
    const center = event.target.getCenter();
    this.valueChange.emit(['center', center]);
  }

  async initialize() {
    this.init = true;
    const permission = await this.getPermission();

    if (permission) {
      this.hasPermission = true;
      const { coords } = await Geolocation.getCurrentPosition();
      this.center = [coords.longitude, coords.latitude];
    } else {
      this.hasPermission = false;

      this.alert.present({
        title: 'Permission',
        text: 'Vous devez autoriser l’accès à votre position pour afficher l’itinéraire.',
        showCancelButton: true,
        confirmButtonText: 'Autoriser',
        cancelButtonText: 'Annuler',
      }).then(result => {
        if (result.isConfirmed) {
          if (this.platform.is('android')) {
            NativeSettings.openAndroid({ option: AndroidSettings.ApplicationDetails });
          } else {
            NativeSettings.openIOS({ option: IOSSettings.App });
          }
        }
      });
    }
  }

  private async getPermission() {
    let granted = false;
    const permissions = await Geolocation.checkPermissions();

    if (permissions.location === 'granted') {
      granted = true;
    } else {
      const status = await Geolocation.requestPermissions();

      if (status.location === 'granted') {
        granted = true;
      }
    }

    return granted;
  }
}
