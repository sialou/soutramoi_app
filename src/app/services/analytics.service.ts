import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { getAnalytics, logEvent, setUserId, setAnalyticsCollectionEnabled, setCurrentScreen } from '@angular/fire/analytics';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private nativeAnalytics = FirebaseAnalytics;
  private instance = getAnalytics();

  constructor(private platform: Platform) { }

  setEnable(enabled: boolean) {
    if (this.platform.is('hybrid')) {
      this.nativeAnalytics.setCollectionEnabled({ enabled });
    } else {
      setAnalyticsCollectionEnabled(this.instance, enabled);
    }
  }

  setUserId(id: string, options?: any) {
    if (this.platform.is('hybrid')) {
      this.nativeAnalytics.setUserId({ userId: id });
    } else {
      setUserId(this.instance, id, options);
    }
  }

  logEvent(name: string, params?: { [key: string]: any }) {
    if (this.platform.is('hybrid')) {
      this.nativeAnalytics.logEvent({ name, params });
    } else {
      logEvent(this.instance, name, params);
    }
  }

  setScreenName(name: string, params?: any) {
    if (this.platform.is('hybrid')) {
      this.nativeAnalytics.setScreenName({ screenName: name });
    } else {
      setCurrentScreen(this.instance, name, params);
    }
  }
}
