import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service'; // AuthService’ni import qilamiz
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  @Output() loginSuccess = new EventEmitter<{ name: string; role: string; avatar: string; token: string }>();

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = null; // Har bir yangi urinishda xato xabarini tozalash
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe({
        next: (user) => {
          this.loginSuccess.emit(user); // Event emit qilamiz
          this.router.navigate(['/my-activity']); // Muvaffaqiyatli login’dan so‘ng yo‘naltirish
        },
        error: (err) => {
          this.errorMessage = err.message; // Xato xabarini ko‘rsatish
        }
      });
    } else {
      this.errorMessage = 'Please fill in both username and password.';
    }
  }
}