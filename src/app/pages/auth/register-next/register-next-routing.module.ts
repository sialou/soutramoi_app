import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterNextGuard } from './register-next.guard';
import { RegisterNextPage } from './register-next.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterNextPage,
    canActivate: [RegisterNextGuard],
  },
];

@NgModule({
  providers: [RegisterNextGuard],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterNextPageRoutingModule { }
