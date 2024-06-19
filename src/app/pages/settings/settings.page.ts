import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { App } from '@capacitor/app';
import { Share } from '@capacitor/share';
import { RateApp } from 'capacitor-rate-app';

//import packageJson from 'package.json';
import { environment } from 'src/environments/environment';

import { AlertService } from 'src/app/services/alert.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  settings: Settings;
  notifications = true;
  version = '1.0.0';

  constructor(
    private platform: Platform,
    private app: AppService,
    private alert: AlertService,
  ) {
    if (!environment.production) {
      //this.version = packageJson.version;
    }
  }

  async ngOnInit() {
    if (this.platform.is('hybrid')) {
      const info = await App.getInfo();
      this.version = info.version;
    }

    this.settings = await this.app.getSettings();
    this.notifications = this.settings.notifications;
  }

  onNotificationsChange(state: boolean) {
    this.settings.notifications = state;
    this.app.setSettings(this.settings);
  }

  toggleNotifications(event) {
    if (event.target.localName && event.target.localName !== 'ion-toggle') {
      this.notifications = !this.notifications;
      this.onNotificationsChange(this.notifications);
    }
  }

  review() {
    RateApp.requestReview();
  }

  share() {
    Share.share({
      title: 'Besoin d\'aide pour les services de dépannage. https://www.soutramoi.com',
      url: 'https://www.soutramoi.com/',
      dialogTitle: 'SoutraMoi',
    });
  }

  link(url: string) {
    window.open(url, '_blank').focus();
  }

  about() {
    this.alert.present({
      background: '#FFFFFF',
      showCancelButton: false,
      showConfirmButton: true,
      customClass: {
        container: 'about-dialog-content',
        confirmButton: 'about-dialog-button',
      },
      html: `
        <div class="about-dialog-body">
          <img src="assets/img/logo-name-dark.png" alt="SoutraMoi" class="logo">
          <p>
            SoutraMoi est la plateforme de référence qui vous met en relation avec des professionnels à proximité de chez vous, pour tous type de service.
          </p>
          <h5>Pour en savoir plus, visitez :</h5>
          <h4><a href="https://www.soutramoi.com/" target="blank">www.soutramoi.com</a></h4>
          <div class="version">Version ${this.version}</div>
          <div class="author">Conçu par Soutramoi</div>
        </div>
      `,
    });
  }
}
