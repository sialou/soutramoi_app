import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared';
import { SearchPage } from './search.page';
import { SearchPageRoutingModule } from './search-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    SearchPageRoutingModule,
  ],
  declarations: [SearchPage]
})
export class SearchPageModule { }
