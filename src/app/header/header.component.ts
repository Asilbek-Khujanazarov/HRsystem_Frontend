import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: { name: string; role: string; avatar: string } | null = null;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  goToLogin() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  onSearch() {
    console.log('Global search clicked');
  }

  onNotifications() {
    console.log('Notifications clicked');
  }
}
