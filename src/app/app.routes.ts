import { Routes } from '@angular/router';
import { PageComponent } from './page/page.component';
import { DirectoryComponent } from './directory/directory.component';
import { EmployeeComponent } from './employee/employee.component';
import { MyActivityComponent } from './my-activity/my-activity.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { RecruitersComponent } from './recruiters/recruiters.component';
import { AttendanceComponent } from './attendance/attendance.component'; // importing  attendance component
import { DepartmentComponent } from './department/department.component';

export const routes: Routes = [
  { path: 'my-activity', component: MyActivityComponent},
  { path: 'login', component: LoginComponent },
  { path: 'my-activity', component: MyActivityComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: PageComponent, data: { page: 'tasks' } },
  { path: 'time', component: PageComponent, data: { page: 'time' } },
  { path: 'calendar', component: PageComponent, data: { page: 'calendar' } },
  { path: 'directory', component: DirectoryComponent }, // Alohida komponent
  { path: 'employees', component: EmployeeComponent},
  { path: 'performance', component: RecruitersComponent},
  { path: 'projects', component: PageComponent, data: { page: 'projects' } },
  { path: 'surveys', component: PageComponent, data: { page: 'surveys' } },
  { path: 'assets', component: PageComponent, data: { page: 'assets' } },
  { path: 'knowledge-base', component: PageComponent, data: { page: 'knowledge-base' } },
  { path: 'case-management', component: PageComponent, data: { page: 'case-management' } },
  { path: 'reports', component: PageComponent, data: { page: 'reports' } },
  { path: 'settings', component: PageComponent, data: { page: 'settings' } },
  { path: '', redirectTo: '/my-activity', pathMatch: 'full' },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'department', component: DepartmentComponent },

];


