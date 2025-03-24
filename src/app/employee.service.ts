import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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

  private safeGetCookie(key: string): string {
    return isPlatformBrowser(this.platformId) ? this.cookieService.get(key) : '';
  }
  
  private safeSetCookie(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.set(key, value, 7);
    }
  }

  private safeDeleteCookie(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.delete(key);
    }
  }

  login(userName: string, password: string): Observable<{ name: string; role: string; avatar: string; token: string }> {
    const body = { userName, password };
    return this.http.post<any>(`${this.apiUrl}/api/Employee/login`, body).pipe(
      switchMap(response => {
        const user = {
          name: response.username || 'Unknown User',
          role: response.role || 'Employee',
          avatar: '',
          token: response.token
        };
        this.safeSetCookie('token', response.token);
        this.safeSetCookie('user', JSON.stringify(user));

        return this.getProfileImage().pipe(
          map(imageResponse => {
            user.avatar = imageResponse.imagePath ? `${this.apiUrl}${imageResponse.imagePath}` : '';
            this.safeSetCookie('user', JSON.stringify(user));
            return user;
          }),
          catchError(err => {
            user.avatar = '';
            this.safeSetCookie('user', JSON.stringify(user));
            return of(user);
          })
        );
      }),
      catchError(this.handleError)
    );
  }

  getUser(): Observable<{ name: string; role: string; avatar: string; token: string } | null> {
    const user = this.safeGetCookie('user');
    return of(user ? JSON.parse(user) : null);
  }

  getProfileImage(): Observable<{ imagePath: string | null }> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<{ imagePath: string | null }>(`${this.apiUrl}/api/Employee/get-profile-image`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

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

  logout() {
    this.safeDeleteCookie('user');
    this.safeDeleteCookie('token');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    // `ErrorEvent`dan foydalanish o‘rniga, `error` ob'ektining xususiyatlaridan foydalanamiz
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