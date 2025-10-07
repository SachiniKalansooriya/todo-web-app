// ...existing code...
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';

interface AuthResponse { token: string; }
interface User {
  id: number;
  email: string;
  name: string;
  profilePicture: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Don't automatically load here; allow an explicit initialize() to be called
    // so the application can wait for auth to be initialized on startup.
  }

  // Google OAuth2 login - redirect to backend
  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  // Handle the callback from Google OAuth2
  handleAuthCallback(token: string): void {
    this.setToken(token);
    this.loadUserFromToken();
  }

  // Get current user info
  getCurrentUser(): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<User>(`${this.base}/user`, { headers }).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  private loadUserFromToken(): Promise<void> {
    if (!this.isLoggedIn()) {
      this.userSubject.next(null);
      return Promise.resolve();
    }

    // Convert observable to promise so callers can await initialization
    return firstValueFrom(this.getCurrentUser()).then(
      (user) => {
        this.userSubject.next(user as User);
      }
    ).catch(() => {
      // Clear invalid token
      localStorage.removeItem('token');
      this.userSubject.next(null);
    });
  }

  /**
   * Initialize auth state during app bootstrap. Returns a Promise that resolves
   * when user info has been loaded (or cleared). Safe to call multiple times.
   */
  initialize(): Promise<void> {
    return this.loadUserFromToken();
  }

  setToken(token: string): void { 
    localStorage.setItem('token', token); 
  }
  
  getToken(): string | null { 
    return localStorage.getItem('token'); 
  }
  
  isLoggedIn(): boolean { 
    return !!this.getToken(); 
  }
  
  logout(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post(`${this.base}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.userSubject.next(null);
      })
    );
  }

  getCurrentUserValue(): User | null {
    return this.userSubject.value;
  }
}
// ...existing code...