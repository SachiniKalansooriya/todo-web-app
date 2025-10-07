import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskRequest, Status } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getTasksByStatus(status: Status): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/status/${status}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  createTask(taskRequest: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, taskRequest, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateTask(id: number, taskRequest: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, taskRequest, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateTaskStatus(id: number, status: Status): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}/status?status=${status}`, {}, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getOverdueTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/overdue`, { 
      headers: this.getAuthHeaders() 
    });
  }
}