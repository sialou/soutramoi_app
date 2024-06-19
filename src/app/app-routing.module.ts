import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { InitGuard } from './guards/init.guard';
import { LogoutGuard } from './guards/logout.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingPageModule),
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule),
    canActivate: [InitGuard],
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [InitGuard],
  },
  {
    path: 'profile/pro',
    loadChildren: () => import('./pages/profile-pro/profile-pro.module').then(m => m.ProfileProPageModule),
    canActivate: [InitGuard],
  },
  {
    path: 'pro/:id',
    loadChildren: () => import('./pages/pro/pro.module').then(m => m.ProPageModule),
    canActivate: [InitGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
    canActivate: [InitGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    canActivate: [InitGuard, LogoutGuard],
  },
];

@NgModule({
  providers: [AuthGuard, LogoutGuard, InitGuard],
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
})
export class AppRoutingModule { }
