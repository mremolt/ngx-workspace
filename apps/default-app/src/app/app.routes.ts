import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'greeting', loadChildren: './greeting/greeting.module#GreetingModule' },
  { path: 'home', loadChildren: '@mr/pages/home#HomeModule' },
  { path: '**', loadChildren: '@mr/pages/not-found#NotFoundModule' },
];
