import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/my-activity', pathMatch: 'full' },
  { path: 'my-activity', component: PageComponent },
  { path: 'login', component: LoginComponent },
];
