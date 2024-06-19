import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterProPage } from './register-pro.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterProPage,
  },
];

@NgModule({
  providers: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterProPageRoutingModule { }
