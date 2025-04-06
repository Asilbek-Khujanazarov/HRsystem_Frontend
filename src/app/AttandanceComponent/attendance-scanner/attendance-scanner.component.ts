import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-scanner',
  standalone: true,
  imports: [ZXingScannerModule, CommonModule],
  templateUrl: './attendance-scanner.component.html',
  styleUrls: ['./attendance-scanner.component.css']
})
export class AttendanceScannerComponent {
  allowedFormats = [BarcodeFormat.QR_CODE];
  isScanning = false;
  scanResult: string | null = null;
  employeeFullName: string | null = null;
  message: string = '';
  showScanner = false;
  private scannerTimeout: any; // Timeout uchun o'zgaruvchi
  messageType: string | undefined;

  constructor(private http: HttpClient) {}

  openScanner() {
    this.showScanner = true;
    this.isScanning = true;
    this.scanResult = null;
    this.employeeFullName = null;
    this.message = '';

    // 10 soniyadan keyin avtomatik yopilish
    this.scannerTimeout = setTimeout(() => {
      if (this.isScanning) { // Agar hali skan qilinmagan bo'lsa
        this.resetToInitial();
      }
    }, 40000); // 40 soniya (40000 millisekund)
  }

  onCodeResult(result: string) {
    this.scanResult = result;
    this.isScanning = false;
    this.checkEmployee(result);

    // Skan qilingandan keyin timeoutni tozalash
    if (this.scannerTimeout) {
      clearTimeout(this.scannerTimeout);
    }
  }

  checkEmployee(employeeId: string) {
    this.http.get(`http://localhost:5190/api/Employee/GetEmployeeNameId?id=${employeeId}`).subscribe({
      next: (response: any) => {
        this.employeeFullName = `${response.firstName} ${response.lastName}`;
        this.message = '';
      },
      error: (err) => {
        console.error('Employee check error:', err);
        this.employeeFullName = null;
        this.message = 'Bunday xodim mavjud emas';
        setTimeout(() => this.resetToInitial(), 2000);
      }
    });
  }

  submitAttendance(type: 'entry' | 'exit') {
    if (!this.scanResult) return;
  
    const url = type === 'entry' 
      ? 'http://localhost:5190/api/Attendance/entry' 
      : 'http://localhost:5190/api/Attendance/exit';
  
    this.http.post(url, { employeeId: this.scanResult }).subscribe({
      next: (response: any) => {
        this.messageType = 'success';
        this.message = response.message || `${type === 'entry' ? 'Kirish' : 'Chiqish'} muvaffaqiyatli qayd etildi!`;
        setTimeout(() => this.resetToInitial(), 3000);
      },
      error: (err) => {
        console.error('Attendance submit error:', err);
        
        // Xabarni aniqlab ko‘rsatish
        this.messageType = 'error';
        if (err.error?.message) {
          this.message = err.error.message;
        } else if (err.status === 0) {
          this.message = "Serverga ulanishda muammo. API ishlayaptimi?";
        } else {
          this.message = "Noma'lum xatolik yuz berdi!";
        }
  
        setTimeout(() => this.resetToInitial(), 4000);
      }
    });
  }
  


  resetToInitial() {
    this.showScanner = false;
    this.isScanning = false;
    this.scanResult = null;
    this.employeeFullName = null;
    this.message = '';
    if (this.scannerTimeout) {
      clearTimeout(this.scannerTimeout); // Timeoutni tozalash
    }
  }
}