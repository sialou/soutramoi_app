import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(
    private storage: StorageService,
    private auth: AuthService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const name = this.auth.TokenHeaderName;

    return next.handle(request).pipe(tap({
      next: event => {
        if (event instanceof HttpResponse && event.headers.has(name)) {
          this.storage.set(this.auth.TokenKey, event.headers.get(name));
        }
      }
    }));
  }
}
