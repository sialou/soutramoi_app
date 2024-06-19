import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared';
import { OnboardingPage } from './onboarding.page';
import { OnboardingPageRoutingModule } from './onboarding-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OnboardingPageRoutingModule,
  ],
  declarations: [OnboardingPage]
})
export class OnboardingPageModule { }
