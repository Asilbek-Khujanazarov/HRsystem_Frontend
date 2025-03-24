import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5190';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Tokenni saqlash
  private safeGetCookie(key: string): string {
    return isPlatformBrowser(this.platformId) ? this.cookieService.get(key) : '';
  }

  // Tokenni olish
  getToken(): string | null {
    return this.safeGetCookie('token') || null;
  }

  // Foydalanuvchi autentifikatsiya qilinganligini tekshirish
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Token mavjud bo‘lsa true, aks holda false
  }

  // Login metodi
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(`${this.apiUrl}/api/Auth/login`, body).pipe(
      tap(response => {
        if (response.token) {
          this.cookieService.set('token', response.token, 1, '/'); // Tokenni 1 kunlik cookie sifatida saqlash
        }
      }),
      catchError(this.handleError)
    );
  }

  // Logout metodi
  logout(): void {
    this.cookieService.delete('token', '/');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error && typeof error.error === 'string') {
      errorMessage = `Error: ${error.error}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 0) errorMessage = 'Unable to connect to the server. Please check if the backend server is running.';
      else if (error.status === 401) errorMessage = 'Unauthorized. Please check your credentials.';
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}