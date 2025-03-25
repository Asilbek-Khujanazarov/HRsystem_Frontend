import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://localhost:5190';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private safeGetCookie(key: string): string {
    return isPlatformBrowser(this.platformId) ? this.cookieService.get(key) : '';
  }

  getMyAttendance(year?: number, month?: number): Observable<any> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));

    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    if (month) params = params.set('month', month.toString());

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(`${this.apiUrl}/api/Attendance/my-attendance`, { headers, params }).pipe(
      catchError(this.handleError)
    );
  }

  postAttendanceEntry(employeeId: number) {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));

    let params = new HttpParams();
    if (employeeId) params = params.set('employeeId', employeeId.toString());

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<any>(`${this.apiUrl}/api/Attendance/entry`, { headers, params }).pipe(
      catchError(this.handleError)
    );
  }

  postAttendanceExit(employeeId: number) {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));

    let params = new HttpParams();    
    if (employeeId) params = params.set('employeeId', employeeId.toString());

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<any>(`${this.apiUrl}/api/Attendance/exit`, { headers, params }).pipe(
      catchError(this.handleError)
    );
  }

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