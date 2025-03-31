import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'My activity', path: '/my-activity', icon: 'person' },
    { label: 'Tasks', path: '/tasks', icon: 'assignment' },
    { label: 'Time', path: '/time', icon: 'access_time' },
    { label: 'Calendar', path: '/calendar', icon: 'calendar_today' },
    { label: 'Directory', path: '/directory', icon: 'folder' },
    { label: 'Employees', path: '/employees', icon: 'group' },
    { label: 'Department', path: '/department', icon: 'corporate_fare' },
    { label: 'Attendance', path: '/attendance', icon: 'schedule' },
    { label: 'Performance', path: '/performance', icon: 'emoji_events' },
    { label: 'Projects', path: '/projects', icon: 'folder_open' },
    { label: 'Surveys', path: '/surveys', icon: 'favorite' },
    { label: 'Assets', path: '/assets', icon: 'category' },
    { label: 'Knowledge base', path: '/knowledge-base', icon: 'book' },
    { label: 'Case management', path: '/case-management', icon: 'assignment_turned_in' },
    { label: 'Reports', path: '/reports', icon: 'bar_chart' },
    { label: 'Settings', path: '/settings', icon: 'settings' }
  ];

  constructor(public sidebarService: SidebarService) {}

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}