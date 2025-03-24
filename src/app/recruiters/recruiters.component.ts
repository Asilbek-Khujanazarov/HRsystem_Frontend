import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruiters.component.html',
  styleUrls: ['./recruiters.component.css']
})
export class RecruitersComponent {
  emailAddress = 'asilbekpersonal@gmail.com';
}