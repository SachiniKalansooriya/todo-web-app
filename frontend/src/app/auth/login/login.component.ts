import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  error = '';
  loading = false;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  loginWithGoogle() {
    this.loading = true;
    this.auth.loginWithGoogle();
  }
}