import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { EmployeeService } from '../employee.service';
import { AttendanceService } from '../attendance.service';
import { PayrollService } from '../payroll.service';
import { Employee } from '../models/employee.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-activity',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatListModule,
    BaseChartDirective,
    FormsModule
  ],
  templateUrl: './my-activity.component.html',
  styleUrls: ['./my-activity.component.css']
})
export class MyActivityComponent implements OnInit {
  employee: { name: string; role: string; avatar: string; token: string } | null = null;
  employeeDetails: Employee | null = null;
  attendances: any[] = [];
  payrolls: any[] = [];
  errorMessage: string | null = null;

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  months: { value: number, name: string }[] = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
    { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
    { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];
  calendarDays: { day: number, status: string }[] = [];

  timeOffStats = {
    annualLeave: 28.0,
    sickLeave: 15.0,
    withoutPay: 0.0
  };

  requests = [
    {
      leaveType: 'Annual Leave',
      dateRange: '31 Oct 22 - 02 Nov 22',
      amount: '3.0 days',
      status: 'Approved'
    }
  ];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Hours Worked',
        fill: false,
        borderColor: '#3498db',
        tension: 0.4
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Hours Worked', color: '#2c3e50', font: { size: 14 } },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        ticks: { color: '#7f8c8d' }
      },
      x: {
        title: { display: true, text: 'Date', color: '#2c3e50', font: { size: 14 } },
        grid: { display: false },
        ticks: { color: '#7f8c8d' }
      }
    },
    plugins: {
      legend: { labels: { color: '#2c3e50', font: { size: 14 } } },
      tooltip: { backgroundColor: '#3498db', titleColor: '#fff', bodyColor: '#fff', borderColor: '#2980b9', borderWidth: 1 }
    }
  };
  public lineChartLegend = true;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private payrollService: PayrollService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadEmployeeDetails();
    this.loadAttendanceData();
    this.loadPayrollData();
  }

  loadUserData() {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.employee = user;
        if (!this.employee) {
          this.snackBar.open('No user data found.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.snackBar.open(this.errorMessage ?? 'An error occurred', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        this.router.navigate(['/login']);
      }
    });
  }

  loadEmployeeDetails() {
    this.employeeService.getCurrentEmployee().subscribe({
      next: (employee) => {
        this.employeeDetails = employee;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.snackBar.open(this.errorMessage ?? 'An error occurred', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  loadAttendanceData() {
    this.attendanceService.getMyAttendance(this.selectedYear, this.selectedMonth).subscribe({
      next: (response) => {
        this.attendances = response.attendances || [];
        this.prepareChartData();
        this.prepareCalendarData();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.snackBar.open(this.errorMessage ?? 'An error occurred', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  loadPayrollData() {
    this.payrollService.getMyPayrolls().subscribe({
      next: (response) => {
        this.payrolls = response || [];
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.snackBar.open(this.errorMessage ?? 'An error occurred', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  prepareChartData() {
    const labels: string[] = [];
    const data: number[] = [];

    this.attendances.forEach(attendance => {
      const date = new Date(attendance.attendanceDate).toLocaleDateString();
      labels.push(date);
      data.push(attendance.hoursWorked);
    });

    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = data;
  }

  prepareCalendarData() {
    this.calendarDays = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    let firstAttendanceDate: Date | null = null;
    if (this.attendances.length > 0) {
      const sortedAttendances = [...this.attendances].sort((a, b) => 
        new Date(a.attendanceDate).getTime() - new Date(b.attendanceDate).getTime()
      );
      firstAttendanceDate = new Date(sortedAttendances[0].attendanceDate);
    }

    const firstYear = firstAttendanceDate ? firstAttendanceDate.getFullYear() : currentYear;
    const firstMonth = firstAttendanceDate ? firstAttendanceDate.getMonth() + 1 : currentMonth;
    const firstDay = firstAttendanceDate ? firstAttendanceDate.getDate() : currentDay;

    const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    const attendanceMap = new Map<string, any>();

    this.attendances.forEach(att => {
      const date = new Date(att.attendanceDate);
      const day = date.getDate();
      attendanceMap.set(`${day}`, att);
    });

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.selectedYear, this.selectedMonth - 1, day);
      const dateString = date.toISOString().split('T')[0];
      const attendance = attendanceMap.get(`${day}`);

      let status = 'absent';

      if (
        (this.selectedYear < firstYear) ||
        (this.selectedYear === firstYear && this.selectedMonth < firstMonth) ||
        (this.selectedYear === firstYear && this.selectedMonth === firstMonth && day < firstDay)
      ) {
        status = 'past';
      } else {
        if (
          (this.selectedYear > currentYear) ||
          (this.selectedYear === currentYear && this.selectedMonth > currentMonth) ||
          (this.selectedYear === currentYear && this.selectedMonth === currentMonth && day > currentDay)
        ) {
          status = 'future';
        } else {
          if (this.selectedYear === currentYear && this.selectedMonth === currentMonth && day === currentDay) {
            status = 'ongoing';
          } else {
            if (attendance) {
              status = 'present';
            } else {
              status = 'absent';
            }
          }
        }
      }

      this.calendarDays.push({ day, status });
    }
  }

  public getEmptyDays(): number[] {
    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth - 1, 1).getDay();
    return Array(firstDayOfMonth).fill(null);
  }

  previousMonth() {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.loadAttendanceData();
  }

  nextMonth() {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.loadAttendanceData();
  }

  getMonthName(): string {
    return this.months.find(month => month.value === this.selectedMonth)?.name || '';
  }

  getFullName(): string {
    return this.employee?.name || 'N/A';
  }

  recordTimeOff(type: string) {
    console.log(`Recording time off for ${type}`);
    this.snackBar.open(`Recording ${type} time off...`, 'Close', { duration: 3000, panelClass: ['info-snackbar'] });
  }

  onImageError() {
    if (this.employee) {
      this.employee.avatar = '';
    }
  }
}