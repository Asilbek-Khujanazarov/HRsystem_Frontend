import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';
import { DirectoryComponent } from './directory/directory.component';

export const routes: Routes = [
  { path: 'my-activity', component: PageComponent, data: { page: 'my-activity' } },
  { path: 'tasks', component: PageComponent, data: { page: 'tasks' } },
  { path: 'time', component: PageComponent, data: { page: 'time' } },
  { path: 'calendar', component: PageComponent, data: { page: 'calendar' } },
  { path: 'directory', component: DirectoryComponent }, // Alohida komponent
  { path: 'employee', component: PageComponent, data: { page: 'employee' } },
  { path: 'performance', component: PageComponent, data: { page: 'performance' } },
  { path: 'projects', component: PageComponent, data: { page: 'projects' } },
  { path: 'surveys', component: PageComponent, data: { page: 'surveys' } },
  { path: 'assets', component: PageComponent, data: { page: 'assets' } },
  { path: 'knowledge-base', component: PageComponent, data: { page: 'knowledge-base' } },
  { path: 'case-management', component: PageComponent, data: { page: 'case-management' } },
  { path: 'reports', component: PageComponent, data: { page: 'reports' } },
  { path: 'settings', component: PageComponent, data: { page: 'settings' } },
  { path: '', redirectTo: '/my-activity', pathMatch: 'full' }
];