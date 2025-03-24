import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EmployeeService } from '../employee.service'; // Yangi xizmat
import { Employee } from '../models/employee.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  employees: Employee[] = [];
  dataSource = new MatTableDataSource<Employee>([]);
  displayedColumns: string[] = ['profileImage', 'name', 'email', 'phoneNumber', 'city', 'departmentName', 'position', 'role'];
  roles: string[] = ['All', 'Admin', 'Employee', 'Manager'];
  selectedRole: string = 'All';
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: EmployeeService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadEmployees();
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      return fullName.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.applyFilter();
        this.errorMessage = null;
        if (employees.length === 0) {
          this.snackBar.open('No employees found.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
        const messageToShow = this.errorMessage ?? 'An error occurred. Please try again.';
        this.snackBar.open(messageToShow, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  applyFilter() {
    let filteredData = this.employees;
    if (this.selectedRole !== 'All') {
      filteredData = this.employees.filter(emp => emp.role === this.selectedRole);
    }
    this.dataSource.data = filteredData;
    if (this.dataSource.filter) {
      this.dataSource.filter = this.dataSource.filter;
    }
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  getFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName}`;
  }
}