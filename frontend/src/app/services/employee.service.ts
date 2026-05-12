import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee, ApiResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:3000/api/employees';

  constructor(private http: HttpClient) {}

  // GET all employees (with optional search)
  getEmployees(search?: string): Observable<Employee[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http
      .get<ApiResponse<Employee[]>>(this.apiUrl, { params })
      .pipe(
        map((res) => res.data ?? []),
        catchError(this.handleError)
      );
  }

  // GET single employee
  getEmployee(id: number): Observable<Employee> {
    return this.http
      .get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`)
      .pipe(
        map((res) => res.data!),
        catchError(this.handleError)
      );
  }

  // POST create employee
  createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Observable<Employee> {
    return this.http
      .post<ApiResponse<Employee>>(this.apiUrl, employee)
      .pipe(
        map((res) => res.data!),
        catchError(this.handleError)
      );
  }

  // PUT update employee
  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    return this.http
      .put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, employee)
      .pipe(
        map((res) => res.data!),
        catchError(this.handleError)
      );
  }

  // DELETE employee
  deleteEmployee(id: number): Observable<{ id: number; deleted: boolean }> {
    return this.http
      .delete<ApiResponse<{ id: number; deleted: boolean }>>(`${this.apiUrl}/${id}`)
      .pipe(
        map((res) => res.data!),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    const msg =
      error?.error?.message ?? error?.message ?? 'An unknown error occurred';
    return throwError(() => new Error(msg));
  }
}
