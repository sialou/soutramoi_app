import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { ProfileProPageRoutingModule } from './profile-pro-routing.module';
import { SharedModule } from 'src/app/shared';
import { ProfileProPage } from './profile-pro.page';
import { ProfileProProductsComponent } from './components/profile-pro-products.component';
import { ProfileProServicesComponent } from './components/profile-pro-services.component';
import { ProfileProMapComponent } from './components/profile-pro-map.component';
import { ProfileProInfosComponent } from './components/profile-pro-infos.component';
import { ProfileProImagesComponent } from './components/profile-pro-images.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxMapboxGLModule,
    SharedModule,
    ProfileProPageRoutingModule
  ],
  declarations: [
    ProfileProPage,
    ProfileProProductsComponent,
    ProfileProServicesComponent,
    ProfileProMapComponent,
    ProfileProInfosComponent,
    ProfileProImagesComponent,
  ]
})
export class ProfileProPageModule { }
