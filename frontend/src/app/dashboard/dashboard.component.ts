import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

interface User {
  id: number;
  email: string;
  name: string;
  profilePicture: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section" *ngIf="user$ | async as user">
        <h2>Welcome back, {{ user.name }}!</h2>
        <p>You're successfully authenticated with Google OAuth2.</p>
        
        <div class="user-details">
          <div class="detail-item">
            <strong>Email:</strong> {{ user.email }}
          </div>
          <div class="detail-item">
            <strong>User ID:</strong> {{ user.id }}
          </div>
        </div>
      </div>
      
      <div class="todo-section">
        <h3>Your Todos</h3>
        <p>Todo functionality will be implemented here...</p>
        
        <!-- Placeholder for todo list -->
        <div class="placeholder-content">
          <div class="placeholder-item">✅ Add todo functionality</div>
          <div class="placeholder-item">📝 Create todo items</div>
          <div class="placeholder-item">🗑️ Delete completed todos</div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    // Ensure user data is loaded
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe();
    }
  }
}