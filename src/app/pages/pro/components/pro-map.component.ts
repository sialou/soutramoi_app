import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { StartNavigation } from '@proteansoftware/capacitor-start-navigation';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'pro-map',
  styleUrls: ['./pro-map.component.scss'],
  template: `
    <div class="profile-heading">Localisation</div>
    <div class="map-tiles" [style.backgroundImage]="'url(' + map + ')'">
      <img src="assets/img/map-pin.svg" alt="Marker">
    </div>
    <button type="button" (click)="navigate()">
      Afficher l’itinéraire
    </button>
  `,
})
export class ProMapComponent implements OnInit {
  @Input() profile: Professional;

  map: string;

  constructor(
    private platform: Platform,
  ) { }

  ngOnInit() {
    const accessToken = environment.mapboxToken;
    const lngLat = `${this.profile.coords.lat},${this.profile.coords.lng}`;
    this.map = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lngLat},12.5,0.00,0.00/512x512@2x?access_token=${accessToken}`;
  }

  async navigate() {
    if (!this.platform.is('hybrid')) {
      console.warn('Navigation only works on hybrid platforms');
      return;
    }

    const { coords, name } = this.profile;

    await StartNavigation.launchMapsApp({
      name,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  }
}
