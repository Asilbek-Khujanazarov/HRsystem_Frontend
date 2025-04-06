import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EmployeeService } from './Services/employee.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideHttpClient(),importProvidersFrom(MatIconModule) ,provideHttpClient(withInterceptors([])), EmployeeService, CookieService , AuthInterceptor]
};

