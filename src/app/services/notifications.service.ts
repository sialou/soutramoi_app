import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notifications: LocalNotificationSchema[] = [];

  private push = PushNotifications;
  private local = LocalNotifications;

  constructor(
    private platform: Platform,
    private auth: AuthService,
  ) {
    this.initialize();
  }

  schedule() {
    if (!this.platform.is('hybrid')) {
      return false;
    }

    this.cancel().then(() => {
      this.initialize();
      this.local.schedule({ notifications: this.notifications });
    });

    return true;
  }

  requestPermission() {
    if (!this.platform.is('hybrid')) {
      return false;
    }

    this.local.checkPermissions().then(res => {
      if (res.display !== 'granted') {
        this.local.requestPermissions().then(req => {
          if (req.display === 'granted') {
            this.register();
          }
        });
      } else {
        this.register();
      }
    });

    return true;
  }

  cancel() {
    return this.local.cancel({ notifications: this.notifications });
  }

  sendPush(notification: LocalNotificationSchema) {
    return this.local.schedule({ notifications: [notification] });
  }

  firstTimeNotification() {
    return this.local.schedule({
      notifications: [{
        id: 41,
        title: 'Bienvenue sur la plateforme SoutraMoi !',
        body: 'Nous sommes heureux de vous avoir parmis nous.'
      }]
    });
  }

  private async initialize() {
    this.notifications = [];
    this.dailyNotification();
    // this.mondayNotification();
  }

  private register() {
    this.push.register();
  }

  private async dailyNotification() {
    const title = await this.getTitle();

    this.notifications.push({
      id: 42,
      title,
      body: 'N\'hésitez pas à faire un tour sur la plateforme si vous avez besoin des services d\'un professionel.',
      schedule: { on: { hour: 9, minute: 30, second: 0 }, repeats: true }
    });
  }

  private async mondayNotification() {
    const monday = 1;
    const time = new Date();
    const currentDay = new Date().getDay();
    let dayDifference = monday - currentDay;
    const title = await this.getTitle();

    if (dayDifference < 0) {
      dayDifference = dayDifference + 7;
    }

    time.setHours(time.getHours() + 24 * dayDifference);

    this.notifications.push({
      id: 43,
      title,
      body: 'Ça vous fera du bien de débuter la semaine avec un nouveau records.',
      schedule: { at: time, repeats: true }
    });
  }

  private async getTitle() {
    const user = this.auth.currentUser();
    return (user !== null) ? 'Bonjour ' + user.displayName + ' !' : 'Bonjour champion !';
  }
}
