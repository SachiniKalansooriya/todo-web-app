import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  `,
  styleUrl: './auth-callback.component.css'
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get token from query parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.handleAuthCallback(token);
        this.router.navigate(['/dashboard']); // Redirect to dashboard
      } else {
        // If no token, redirect to login with error
        this.router.navigate(['/login'], { 
          queryParams: { error: 'Authentication failed' } 
        });
      }
    });
  }
}