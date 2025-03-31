import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Employee } from './models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:5190';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Cookie’dan tokenni olish uchun yordamchi metod
  private safeGetCookie(key: string): string {
    return isPlatformBrowser(this.platformId) ? this.cookieService.get(key) : '';
  }

  // Barcha xodimlarni olish
  getEmployees(): Observable<Employee[]> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Employee[]>(`${this.apiUrl}/api/Employee`, { headers }).pipe(
      map(employees => employees.map(emp => ({
        ...emp,
        profileImagePath: emp.profileImagePath ? `${this.apiUrl}${emp.profileImagePath}` : null
      }))),
      catchError(this.handleError)
    );
  }

  // Joriy xodim ma’lumotlarini olish
  getCurrentEmployee(): Observable<Employee> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Employee>(`${this.apiUrl}/api/Employee/my-info`, { headers }).pipe(
      map(employee => ({
        ...employee,
        profileImagePath: employee.profileImagePath ? `${this.apiUrl}${employee.profileImagePath}` : null
      })),
      catchError(this.handleError)
    );
  }

  // Xatolarni boshqarish
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error && typeof error.error === 'string') {
      errorMessage = `Error: ${error.error}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 0) errorMessage = 'Unable to connect to the server. Please check if the backend server is running.';
      else if (error.status === 401) errorMessage = 'Unauthorized. Please login again.';
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}