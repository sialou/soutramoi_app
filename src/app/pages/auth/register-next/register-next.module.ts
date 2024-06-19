import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/shared';
import { RegisterNextPageRoutingModule } from './register-next-routing.module';
import { RegisterNextPage } from './register-next.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RegisterNextPageRoutingModule
  ],
  declarations: [RegisterNextPage]
})
export class RegisterNextPageModule { }
