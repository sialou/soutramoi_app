import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { RouteReuseStrategy } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAnalytics, provideAnalytics, UserTrackingService } from '@angular/fire/analytics';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/index.module';
import { ApiInterceptor } from './helpers/api.interceptor';
import { AuthTokenInterceptor } from './helpers/auth-token.interceptor';

import { NetworkService } from './services/network.service';
import { AnalyticsService } from './services/analytics.service';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { LoaderService } from './services/loader.service';
import { AppService } from './services/app.service';
import { NotificationsService } from './services/notifications.service';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatRippleModule,
    IonicModule.forRoot({ mode: 'md' }),
    NgxMapboxGLModule.withConfig({ accessToken: environment.mapboxToken }),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    SweetAlert2Module.forRoot(),
    SharedModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    UserTrackingService,
    AppService,
    StorageService,
    AnalyticsService,
    NetworkService,
    AuthService,
    LoaderService,
    NotificationsService,
  ],
  entryComponents: [],
})
export class AppModule { }
