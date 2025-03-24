import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: { name: string; role: string; avatar: string; token: string } | null = null;

  constructor(private dialog: MatDialog, private employeeService : EmployeeService) {}

  ngOnInit() {
    this.employeeService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  onSearch() {
    console.log('Global search clicked');
  }

  onNotifications() {
    console.log('Notifications clicked');
  }

  onProfileClick() {
    if (!this.user) {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.componentInstance.loginSuccess.subscribe(user => {
        this.user = user;
        dialogRef.close();
      });
    } else {
      this.logout();
    }
  }

  logout() {
    this.employeeService.logout();
    this.user = null;
  }
}