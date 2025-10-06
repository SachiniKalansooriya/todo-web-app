// ...existing code...
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse { token: string; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(payload: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, payload).pipe(
      tap(res => { if (res && res.token) this.setToken(res.token); })
    );
  }

  setToken(token: string) { localStorage.setItem('token', token); }
  getToken(): string | null { return localStorage.getItem('token'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  logout() { localStorage.removeItem('token'); }
}
// ...existing code...