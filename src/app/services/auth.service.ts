/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  User as FirebaseUser,
  AuthCredential,
  AuthProvider,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithPhoneNumber,
  linkWithCredential,
} from '@angular/fire/auth';
import { Subject } from 'rxjs';

import { StorageService } from './storage.service';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  created_at: string;
  updated_at?: string;
  name: string;
  email: string;
  email_verified: boolean;
  phone: string;
  phone_verified: boolean;
  gender?: 'male' | 'female';
  photo_url: string;
  cover_url: string;
  city: AppLocation;
  town: AppLocation;
  provider?: string;
  provider_id?: null;
  id_token?: string;
}

export interface UserPayload {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  emailVerified: boolean;
  provider: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly key = 'soutramoi_auth';
  readonly TokenKey = 'soutramoi_auth_token';
  readonly TokenHeaderName = 'X-Auth-Token';
  readonly providerKey = 'soutramoi_auth_provider';

  private state = new Subject<User>();

  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    private storage: StorageService,
  ) {
    this.auth.languageCode = 'fr';
  }

  private get auth() {
    const auth = getAuth();
    auth.languageCode = 'fr';

    return auth;
  }

  async isLogged() {
    const user = await this.getUser();
    return user !== null && user !== undefined;
  }

  /**
   * Listen for auth state changes
   */
  listen() {
    return this.state.asObservable();
  }

  /**
   * Sign in anonymously
   */
  anonymous() {
    return new Promise((resolve: (user: FirebaseUser) => void, reject) => {
      signInAnonymously(this.auth).then(res => resolve(res.user), reject);
    });
  }

  /**
   * Sign in with credential
   */
  signInWithCredential(credential: AuthCredential) {
    return new Promise((resolve: (user: FirebaseUser) => void, reject) => {
      signInWithCredential(this.auth, credential).then(r => resolve(r.user), reject);
    });
  }

  /**
   * Sign in with credential
   */
  linkWithCredential(credential: AuthCredential) {
    const user = this.auth.currentUser;

    return new Promise((resolve: (user: FirebaseUser) => void, reject) => {
      linkWithCredential(user, credential).then(r => resolve(r.user), reject);
    });
  }

  /**
   * Sign in with custom provider (Google | Facebook | Apple | ...)
   */
  signInWithProvider(provider: AuthProvider) {
    return new Promise((resolve: (user: FirebaseUser) => void, reject) => {
      signInWithPopup(this.auth, provider).then(r => resolve(r.user), reject);
    });
  }

  signInWithPhoneNumber(phoneNumber: string, appVerifier: any) {
    return new Promise((resolve: (result) => void, reject) => {
      signInWithPhoneNumber(this.auth, phoneNumber, appVerifier).then(r => resolve(r), reject);
    });
  }

  /**
   * Sign in with email and password
   */
  signIn(email: string, password: string) {
    return new Promise((resolve: (user: FirebaseUser) => void, reject) => {
      signInWithEmailAndPassword(this.auth, email, password).then(r => resolve(r.user), reject);
    });
  }

  /**
   * Create a new user with email and password
   */
  signUp(email: string, password: string) {
    return new Promise((resolve: (user: FirebaseUser) => void, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password).then(r => resolve(r.user), reject);
    });
  }

  /**
   * Send email verfificaiton
   */
  sendEmailVerification() {
    const user = this.currentUser();
    return sendEmailVerification(user);
  }

  /**
   * Reset Forggot password
   */
  forgotPassword(email: string): Promise<void> {
    return new Promise((resolve: () => void, reject) => {
      sendPasswordResetEmail(this.auth, email).then(resolve, reject);
    });
  }

  /**
   * Update password for current user
   */
  updatePassword(oldPassword: string, password: string): Promise<void> {
    return new Promise((resolve: () => void, reject) => {
      signInWithEmailAndPassword(this.auth, this.currentUser().email, oldPassword).then(res => {
        updatePassword(res.user, password).then(resolve, reject);
      }).catch(reject);
    });
  }

  /**
   * Get the current user
   */
  currentUser() {
    return this.auth.currentUser;
  }

  /**
   * Sign out current user
   */
  signOut() {
    return this.auth.signOut();
  }

  getIdToken() {
    return this.currentUser().getIdToken();
  }

  login(data: any) {
    return this.http.post('/auth/login', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  register(data: any) {
    return this.http.post('/auth/register', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  provider(data: any) {
    return this.http.post('/auth/provider', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async me() {
    return this.httpClient.get<User>('/me');
  }

  setUser(user: User) {
    return this.storage.set(this.key, user);
  }

  async getUser() {
    return (await this.storage.get(this.key)) as User;
  }

  async getToken() {
    console.log(await this.storage.get('soutramoi_auth_token'));
    return (await this.storage.get(this.TokenKey)) as string;
  }

  async logout() {
    if (this.currentUser() !== null) {
      await this.signOut();
    }

    await this.storage.remove(this.key);
    await this.storage.remove(this.TokenKey);
  }
}
