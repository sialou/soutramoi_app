import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProPage } from './pro.page';

const routes: Routes = [
  {
    path: '',
    component: ProPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProPageRoutingModule { }
