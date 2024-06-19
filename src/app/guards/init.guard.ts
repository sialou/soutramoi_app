import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@ionic/angular';

import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class InitGuard implements CanActivate {
  constructor(
    private router: Router,
    private platform: Platform,
    private storage: StorageService,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isNative = this.platform.is('hybrid');

    if (isNative) {
      const intro: IntroPayload = await this.storage.get('soutramoi_intro');

      if (intro) {
        return true;
      }

      this.router.navigate(['/onboarding'], { skipLocationChange: true });

      return false;
    } else {
      return true;
    }
  }
}
