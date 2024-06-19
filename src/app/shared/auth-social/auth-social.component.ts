import { Component, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  AuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  OAuthCredential,
  signInWithCredential,
  signInWithPopup,
  UserCredential,
} from '@angular/fire/auth';
import { from, Subscription } from 'rxjs';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';

import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'auth-social',
  styleUrls: ['./auth-social.component.scss'],
  template: `
    <button type="button" (click)="signInWithApple()" *ngIf="isIos">
      <svg-asset [src]="'img/apple.svg'" [width]="20"></svg-asset> Se connecter avec Apple
    </button>
    <button type="button" (click)="signInWithFacebook()">
      <svg-asset [src]="'img/facebook.svg'" [width]="20"></svg-asset> Se connecter avec Facebook
    </button>
    <button type="button" (click)="signInWithGoogle()">
      <svg-asset [src]="'img/google.svg'" [width]="20"></svg-asset> Se connecter avec Google
    </button>
  `,
})
export class AuthSocialComponent implements OnDestroy {
  readonly isIos = this.platform.is('ios');
  readonly isNative = this.platform.is('hybrid');
  private subscriptions: Subscription[] = [];
  private auth = getAuth();

  constructor(
    private router: Router,
    private platform: Platform,
    private authService: AuthService,
    private loader: LoaderService,
    private app: AppService,
  ) {
    this.platform.ready().then(() => {
      GoogleAuth.initialize({
        clientId: '297478535727-6m04h9hk77rf43r03r0gdh0tf4t7vb30.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async signInWithApple() {
    await this.loader.present('Connexion...');

    const provider = new OAuthProvider('apple.com');
    provider.setCustomParameters({ locale: 'fr' });

    if (!this.platform.is('hybrid')) {
      provider.addScope('email');
      provider.addScope('name');

      this.signInWithWeb(provider);
      return;
    }

    SignInWithApple.authorize().then(
      res => {
        const credential = provider.credential({ idToken: res.response.identityToken });
        this.signInWithCredential(credential, provider.providerId);
      },
      e => this.app.handlingError(e)
    );
  }

  async signInWithFacebook() {
    await this.loader.present('Connexion...');

    if (!this.platform.is('hybrid')) {
      this.signInWithWeb(new FacebookAuthProvider());
      return;
    }

    FacebookLogin.login({ permissions: ['email', 'public_profile'] }).then(
      res => {
        const credential = FacebookAuthProvider.credential(res.accessToken.token);
        this.signInWithCredential(credential, FacebookAuthProvider.PROVIDER_ID);
      },
      e => this.app.handlingError(e)
    );
  }

  async signInWithGoogle() {
    await this.loader.present('Connexion...');

    if (!this.platform.is('hybrid')) {
      this.signInWithWeb(new GoogleAuthProvider());
      return;
    }

    try {
      const user = await GoogleAuth.signIn();
      const credential = GoogleAuthProvider.credential(user.authentication.idToken);
      this.signInWithCredential(credential, GoogleAuthProvider.PROVIDER_ID);
    } catch (e) {
      this.app.handlingError(e);
    }
  }

  private signInWithCredential(credential: OAuthCredential, provider: string) {
    const promise = signInWithCredential(this.auth, credential);
    this.handle(promise, provider);
  }

  private signInWithWeb(authProvider: AuthProvider) {
    if (!this.isNative && this.authService.currentUser !== null) {
      this.authService.signOut();
    }

    const promise = signInWithPopup(this.auth, authProvider);
    this.handle(promise, authProvider.providerId);
  }

  private handle(promise: Promise<UserCredential>, provider?: string) {
    promise.then(
      async crd => {
        const id_token = await crd.user.getIdToken();
        const payload: any = { provider, id_token };

        const sub = from(this.authService.provider(payload)).subscribe({
          next: async (user: User) => {

            await this.authService.setUser(user);
            await this.loader.dismiss();
            await this.router.navigate(['/tabs/profile']);
          },
          error: err => this.app.handlingError(err)
        });

        this.subscriptions.push(sub);
      },
      e => this.app.handlingError(e)
    );
  }
}
