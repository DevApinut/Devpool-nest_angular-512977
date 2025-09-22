import { Routes } from '@angular/router';
import { Login } from './login/login';
import { User } from './user/user';

export const routes: Routes = [
  { path: 'login', loadComponent: () => Login },
  { path: 'users/me', loadComponent: () => User },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
