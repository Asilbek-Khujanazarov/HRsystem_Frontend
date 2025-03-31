import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {
  private apiUrl = 'http://localhost:3000/api/recruiters'; // Backend API URL

  constructor(private http: HttpClient) {}

  getRecruiters(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  sendRecruiterData(data: any): Observable<any> {
    const payload = { ...data, targetEmail: 'asilbekpersonal@gmail.com' };
    return this.http.post(this.apiUrl, payload);
  }
}