import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { StorageService } from 'src/app/services/storage.service';

@Injectable({ providedIn: 'root' })
export class RegisterNextGuard implements CanActivate {
  constructor(
    private router: Router,
    private storage: StorageService,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const tmp = await this.storage.get('soutramoi_tmp_register');
    const keys = Object.keys(tmp);

    if (keys.includes('name') && keys.includes('phone') && keys.includes('email') && keys.includes('password')) {
      return true;
    }

    this.router.navigate(['/auth/register']);

    return false;
  }
}
