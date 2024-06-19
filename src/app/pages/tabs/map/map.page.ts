import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LngLatLike, Map } from 'mapbox-gl';

import { Geolocation } from '@capacitor/geolocation';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';

import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'tab-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
  map: Map;
  mapCenter: LngLatLike = [-3.9655, 5.2834];
  mapStyle = 'mapbox://styles/mapbox/streets-v11';

  isHybrid = true;
  loaded = false;
  geoPermission = false;

  meData: any = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
  };

  constructor(
    private platform: Platform,
    private alert: AlertService,
  ) {
    this.isHybrid = this.platform.is('hybrid');
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ready(map: Map) {
    this.map = map;
    this.map.resize();
    setTimeout(() => this.initialize(), 1500);
  }

  async locate() {
    const { coords } = await Geolocation.getCurrentPosition();
    const center: LngLatLike = [coords.longitude, coords.latitude];

    // geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    // this.map.getSource('point').setData(geojson);

    if (this.map.getSource('pulse')) {
      const data = { ...this.meData, geometry: { ...this.meData.geometry, coordinates: center } };

      // this.map.getSource('pulse').setData(data);
    } else {
      this.placePulse(center[0], center[1]);
    }

    this.map.flyTo({ center, zoom: 14 });
  }

  private async initialize() {
    this.loaded = true;

    const permission = await this.getPermission();

    if (permission) {
      this.geoPermission = true;
      const { coords } = await Geolocation.getCurrentPosition();
      const center: LngLatLike = [coords.longitude, coords.latitude];

      this.placePulse(center[0], center[1]);
      this.mapCenter = center;
    } else {
      this.geoPermission = false;

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

  private placePulse(lng: number, lat: number) {
    const point = { ...this.meData, geometry: { ...this.meData.geometry, coordinates: [lng, lat] } };

    this.map.addImage('pulse-dot', this.pulseDot(this.map, 100), { pixelRatio: 2 });
    this.map.addSource('pulse', { type: 'geojson', data: point });
    this.map.addLayer({ id: 'pulse', type: 'symbol', source: 'pulse', layout: { 'icon-image': 'pulse-dot' } });
  }

  private pulseDot(map: Map, size = 200) {
    const pulse: {
      width: number;
      height: number;
      data: Uint8Array | Uint8ClampedArray;
      context?: CanvasRenderingContext2D;
      onAdd?: () => void;
      render?: () => void;
    } = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
    };

    pulse.onAdd = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pulse.width;
      canvas.height = pulse.height;
      pulse.context = canvas.getContext('2d');
    };

    pulse.render = () => {
      const duration = 1000;
      const t = (performance.now() % duration) / duration;

      const radius = (size / 2) * 0.3;
      const outerRadius = (size / 2) * 0.7 * t + radius;
      const context = pulse.context;

      // Draw the outer circle.
      context.clearRect(0, 0, pulse.width, pulse.height);
      context.beginPath();
      context.arc(pulse.width / 2, pulse.height / 2, outerRadius, 0, Math.PI * 2);
      context.fillStyle = `rgba(254,105,2, ${1 - t})`;
      context.fill();

      // Draw the inner circle.
      context.beginPath();
      context.arc(pulse.width / 2, pulse.height / 2, radius, 0, Math.PI * 2);
      context.fillStyle = 'rgba(254,105,2, 1)';
      context.strokeStyle = 'white';
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();

      pulse.data = context.getImageData(0, 0, pulse.width, pulse.height).data;
      map.triggerRepaint();

      return true;
    };

    return pulse;
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
