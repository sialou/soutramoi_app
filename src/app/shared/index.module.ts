import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { MatRippleModule } from '@angular/material/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppBackDirective } from '../directives/back.directive';

import { SvgAssetComponent } from './svg-asset/svg-asset.component';
import { ModalComponent } from './modal/modal.component';
import { LoaderComponent } from './loader/loader.component';
import { DialogComponent } from './dialog/dialog.component';
import { SpinnerComponent } from './loader/spinner.component';
import { SpinnerInfinityComponent } from './loader/spinner-infinity.component';
import { RippleComponent } from './ripple/ripple.component';
import { NavbarComponent } from './page/navbar.component';
import { ContentComponent } from './page/content.component';
import { PageComponent } from './page/page.component';
import { InputComponent } from './form/input.component';
import { InputPasswordComponent } from './form/input-password.component';
import { ProfessionalCardComponent } from './professional-card/professional-card.component';
import { AvatarComponent } from './avatar/avatar.component';
import { SwitchComponent } from './switch/switch.component';
import { ListItemComponent } from './list-item/list-item.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { AuthSocialComponent } from './auth-social/auth-social.component';
import { NotifierComponent } from './notifier/notifier.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { CardHeaderComponent } from './card/card-header.component';
import { CardComponent } from './card/card.component';
import { PictureUpdaterComponent } from './picture-updater/picture-updater.component';
import { ProfessionalPlaceholderComponent } from './professional-card/professional-placeholder.component';

import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { DateFormatPipe } from '../pipes/date-format.pipe';

const COMPONENTS_LIST: any[] = [
  SvgAssetComponent,
  ModalComponent,
  LoaderComponent,
  DialogComponent,
  SpinnerComponent,
  SpinnerInfinityComponent,
  ListItemComponent,
  SwitchComponent,
  RippleComponent,
  PageComponent,
  NavbarComponent,
  ContentComponent,
  InputComponent,
  AvatarComponent,
  PlaceholderComponent,
  InputPasswordComponent,
  ProfessionalCardComponent,
  AuthSocialComponent,
  NotifierComponent,
  SubscribeComponent,
  CardHeaderComponent,
  CardComponent,
  PictureUpdaterComponent,
  ProfessionalPlaceholderComponent,
];

const MODULES_LIST: any[] = [
  CommonModule,
  RouterModule,
  IonicModule,
  SwiperModule,
  MatRippleModule,
  SweetAlert2Module,
];

const DIRECTIVES_LIST: any[] = [
  AppBackDirective,
];

const PIPES_LIST: any[] = [
  CapitalizePipe,
  DateFormatPipe,
];

@NgModule({
  declarations: [...COMPONENTS_LIST, ...DIRECTIVES_LIST, ...PIPES_LIST],
  exports: [...MODULES_LIST, ...COMPONENTS_LIST, ...DIRECTIVES_LIST, ...PIPES_LIST],
  imports: [...MODULES_LIST],
})
export class SharedModule { }
