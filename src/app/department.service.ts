import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:5190/api/department'; // Your backend URL

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  addDepartment(department: { departmentName: string }): Observable<any> {
    return this.http.post(this.apiUrl, department);
  }

  updateDepartment(department: { departmentId: number; departmentName: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${department.departmentId}`, department);
  }

  deleteDepartment(departmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${departmentId}`);
  }
}

export interface Department {
  departmentId: number;
  departmentName: string;
}