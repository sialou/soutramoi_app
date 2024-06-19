import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return from(this.handle(req, next));
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    const token = await this.auth.getToken();

    const clone = req.clone({
      url: environment.apiUrl.trim() + req.url,
      setHeaders: {
        'Accept': 'application/json',
      },
    });

    console.log('token', token);

    if (typeof token !== 'undefined') {
      clone.headers.set(this.auth.TokenHeaderName, token);
    }

    return await lastValueFrom(next.handle(clone));
  }
}
