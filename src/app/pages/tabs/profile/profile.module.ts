import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { ProfileCardItemComponent } from './components/profile-card-item.component';
import { ProfilePasswordComponent } from './components/profile-password.component';
import { ProfilePictureComponent } from './components/profile-picture.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    ProfilePageRoutingModule
  ],
  declarations: [
    ProfilePage,
    ProfilePictureComponent,
    ProfileCardItemComponent,
    ProfilePasswordComponent,
  ]
})
export class ProfilePageModule { }
