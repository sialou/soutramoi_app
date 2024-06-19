import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

import { AlertService } from './alert.service';
import { LoaderService } from './loader.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  readonly settingsKey = 'soutramoi_settings';
  readonly errorMessage = 'Erreur survenue, réessayer plus tard.';
  readonly defaultSettings: Settings = {
    theme: 'light',
    notifications: true,
  };

  private settingsStatus = new Subject<Settings>();

  constructor(
    private platform: Platform,
    private alert: AlertService,
    private loader: LoaderService,
    private storage: StorageService,
  ) { }

  listenSettings() {
    return this.settingsStatus.asObservable();
  }

  async getSettings() {
    let settings: Settings = await this.storage.get(this.settingsKey);

    if (!settings) {
      settings = this.defaultSettings;
      await this.storage.set(this.settingsKey, settings);
    }

    return settings;
  }

  async setSettings(settings: Settings) {
    await this.storage.set(this.settingsKey, settings);
    this.settingsStatus.next(settings);
  }

  handlingError(response, popup = true) {
    let error = response;

    if (typeof response.error !== 'undefined') {
      error = response.error;
    }

    if (!this.platform.is('hybrid')) {
      console.error('Error', error);
    }

    let message: string;

    if (error.code && error.message) {
      message = this.getErrorMessage(error);
    } else {
      message = error.message ? error.message : this.errorMessage;

      switch (message) {
        case 'Something went wrong':
          message = this.errorMessage;
          break;
      }
    }

    if (popup) {
      this.loader.dismiss().then(() => this.alert.present(message));
    }

    return message;
  }

  getErrorMessage(error: any) {
    let message: string;

    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Il n\'y a pas d\'utilisateur correspondant à cet identifiant. Le compte a peut-être été supprimé.';
        break;
      case 'auth/wrong-password':
        message = 'Le mot de passe n\'est pas valide ou votre compte n\'a pas de mot de passe.';
        break;
      case 'auth/network-request-failed':
        message = 'Erreur de connexion. Veuillez vous connecter à internet et réessayer.';
        break;
      case 'auth/email-already-in-use':
        message = 'L\'adresse email est déjà utilisée par un autre compte.';
        break;
      case 'auth/account-exists-with-different-credential':
        message = 'Un compte existe déjà avec la même adresse email mais des informations de connexion différentes. Connectez-vous à l\'aide d\'un fournisseur associé à cette adresse e-mail.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Vous avez fermé la fenêtre de connexion avant de finaliser l\'opération. Veuillez réessayer à nouveau.';
        break;
      case 'auth/internal-error':
        message = this.errorMessage;
        break;
      default:
        message = error.message;
        break;
    }

    return message;
  }
}
