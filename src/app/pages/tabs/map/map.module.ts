import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { SharedModule } from 'src/app/shared';
import { MapPageRoutingModule } from './map-routing.module';
import { MapPage } from './map.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxMapboxGLModule,
    SharedModule,
    MapPageRoutingModule
  ],
  declarations: [MapPage]
})
export class MapPageModule { }
