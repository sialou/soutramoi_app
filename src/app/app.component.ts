import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import { pageTransition } from './animations';
import { StorageService } from './services/storage.service';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-root',
  animations: [pageTransition],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
      <app-loader></app-loader>
    </ion-app>

    <!-- <div class="app-preloader" @PageTransition *ngIf="!logged">
      <app-spinner-infinity
        [width]="100"
        [color]="'#FFFFFF'"
        [secondaryColor]="'rgba(255,255,255,0.25)'"
        *ngIf="errorMessage.length === 0"
      ></app-spinner-infinity>
      <div class="message" *ngIf="errorMessage.length > 0">{{errorMessage}}</div>
    </div> -->
  `,
})
export class AppComponent implements OnInit {
  logged = false;
  initialized = false;
  errorMessage = '';

  constructor(
    private platform: Platform,
    private storage: StorageService,
    private notifications: NotificationsService,
  ) { }

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('hybrid')) {
        await this.initializeNative();
        await this.welcomeNative();
      }
    });
  }

  private async initializeNative() {
    setTimeout(() => SplashScreen.hide(), 3000);
    await StatusBar.setOverlaysWebView({ overlay: true });
  }

  private async welcomeNative() {
    const key = 'soutramoi_welcomedate';
    const welcomeDate = await this.storage.get(key);

    if (!welcomeDate) {
      this.notifications.firstTimeNotification();
      await this.storage.set(key, (new Date()).toISOString());
    }
  }
}
