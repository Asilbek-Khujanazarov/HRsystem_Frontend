// src/app/services/product.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private safeGetCookie(key: string): string {
    return isPlatformBrowser(this.platformId) ? this.cookieService.get(key) : '';
  }

  getProducts(): Observable<Product[]> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Product[]>(`${this.apiUrl}/api/Products`, { headers }).pipe(
      map(products =>
        products.map(prod => ({
          ...prod,
          imageUrl: prod.imageUrl ? `${this.apiUrl}${prod.imageUrl}` : null,
        }))
      ),
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<Product> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Product>(`${this.apiUrl}/api/Products/${id}`, { headers }).pipe(
      map(product => ({
        ...product,
        imageUrl: product.imageUrl ? `${this.apiUrl}${product.imageUrl}` : null,
      })),
      catchError(this.handleError)
    );
  }

  addProduct(product: any): Observable<Product> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Product>(`${this.apiUrl}/api/Products`, product, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: any): Observable<Product> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<Product>(`${this.apiUrl}/api/Products/${id}`, product, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  uploadImage(id: number, file: File): Observable<Product> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<Product>(`${this.apiUrl}/api/Products/${id}/upload-image`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  takeProduct(id: number, quantity: number): Observable<Product> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Product>(`${this.apiUrl}/api/Products/${id}/take?quantity=${quantity}`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addToStock(id: number, quantity: number): Observable<Product> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Product>(`${this.apiUrl}/api/Products/${id}/Add?quantity=${quantity}`, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete Product metodi qo'shildi
  deleteProduct(id: number): Observable<void> {
    const token = this.safeGetCookie('token');
    if (!token) return throwError(() => new Error('No token found. Please login first.'));
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiUrl}/api/Products/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error && typeof error.error === 'string') {
      errorMessage = `Error: ${error.error}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 0) errorMessage = 'Unable to connect to the server.';
      else if (error.status === 401) errorMessage = 'Unauthorized. Please login again.';
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}