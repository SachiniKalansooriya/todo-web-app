import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

interface User {
  id: number;
  email: string;
  name: string;
  profilePicture: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  title = 'Todo App';
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    // Initialize user if token exists
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe();
    }
  }

  logout() {
    // Ask user to confirm logout
    const confirmed = window.confirm('Do you want to log out?');
    if (!confirmed) return;

    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
