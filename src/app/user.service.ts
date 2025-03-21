import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUser(): Observable<{ name: string; role: string; avatar: string }> {
    // Bu yerda API’dan ma’lumot olish logikasi bo‘ladi
    return of({
      name: 'John Smith',
      role: 'Product Owner',
      avatar: 'https://via.placeholder.com/40'
    });
  }
}