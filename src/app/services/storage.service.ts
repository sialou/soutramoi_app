import { Injectable, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LOCAL_STORAGE, StorageService as NgxStorage } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly native = localStorage;

  constructor(
    @Inject(LOCAL_STORAGE) private web: NgxStorage,
    private plt: Platform
  ) { }

  async get(key: string) {
    if (this.plt.is('cordova')) {
      return JSON.parse(this.native.getItem(key));
    }

    return this.web.get(key);
  }

  async set(key: string, value: any) {
    if (this.plt.is('cordova')) {
      this.native.removeItem(key);
      this.native.setItem(key, JSON.stringify(value));
    } else {
      this.web.remove(key);
      this.web.set(key, value);
    }
  }

  async remove(key: string) {
    if (this.plt.is('cordova')) {
      this.native.removeItem(key);
    } else {
      this.web.remove(key);
    }
  }

  async clear() {
    if (this.plt.is('cordova')) {
      this.native.clear();
    } else {
      this.web.clear();
    }
  }

  async has(key: string) {
    if (this.plt.is('cordova')) {
      const result = JSON.parse(this.native.getItem(key));
      return result ? true : false;
    }

    return this.web.has(key);
  }

  async keys() {
    return null;
  }
}
