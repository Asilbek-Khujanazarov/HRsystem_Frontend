import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Foydalanuvchi ma'lumotlarini saqlash uchun BehaviorSubject
  private userSubject = new BehaviorSubject<{ name: string; role: string; avatar: string } | null>({
    name: 'John Smith',
    role: 'Product Owner',
    avatar: 'https://via.placeholder.com/40'
  });

  // Foydalanuvchi ma'lumotlarini Observable sifatida qaytarish
  getUser(): Observable<{ name: string; role: string; avatar: string } | null> {
    return this.userSubject.asObservable();
  }

  // Logout metodi: foydalanuvchi ma'lumotlarini tozalash
  logout(): void {
    this.userSubject.next(null); // Foydalanuvchi ma'lumotlarini null qilib tozalash
    // Agar backend bilan ishlayotgan bo‘lsangiz, bu yerda API chaqiruvi bo‘lishi mumkin
    // Masalan: tokenni o‘chirish yoki sessiyani yakunlash
  }
}
