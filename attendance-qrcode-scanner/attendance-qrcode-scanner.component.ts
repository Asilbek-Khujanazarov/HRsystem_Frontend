import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit {
  employeeId: number | null = null;
  isScanning = false;
  scanError = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  // Handle QR code scan result
  onScanSuccess(event: any): void {
    const scannedData = event.data;
    if (scannedData) {
      try {
        // Assuming QR code contains employeeId as a number or in JSON format
        this.employeeId = Number(scannedData) || JSON.parse(scannedData).employeeId;
        this.isScanning = false; // Stop scanning after success
        this.showSnackBar('QR Code scanned successfully!', 'success');
      } catch (error) {
        this.scanError = true;
        this.showSnackBar('Invalid QR Code format', 'error');
      }
    }
  }

  // Start scanning
  startScanning(): void {
    this.isScanning = true;
    this.scanError = false;
    this.employeeId = null;
  }

  // Post attendance entry
  postAttendanceEntry(): void {
    if (!this.employeeId) {
      this.showSnackBar('Please scan a QR code first', 'error');
      return;
    }

    this.http.post('/api/attendance/entry', { employeeId: this.employeeId }).subscribe({
      next: () => this.showSnackBar('Attendance Entry recorded!', 'success'),
      error: () => this.showSnackBar('Failed to record entry', 'error')
    });
  }

  // Post attendance exit
  postAttendanceExit(): void {
    if (!this.employeeId) {
      this.showSnackBar('Please scan a QR code first', 'error');
      return;
    }

    this.http.post('/api/attendance/exit', { employeeId: this.employeeId }).subscribe({
      next: () => this.showSnackBar('Attendance Exit recorded!', 'success'),
      error: () => this.showSnackBar('Failed to record exit', 'error')
    });
  }

  // Show notification
  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}