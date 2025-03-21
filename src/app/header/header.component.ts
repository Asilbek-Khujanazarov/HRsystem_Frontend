import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: { name: string; role: string; avatar: string } | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  onSearch() {
    console.log('Global search clicked');
    // Qidiruv funksiyasini bu yerda qo‘shing
  }

  onNotifications() {
    console.log('Notifications clicked');
    // Bildirishnoma funksiyasini bu yerda qo‘shing
  }
}