import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  showHeader = true;

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

    // Hide header on login/auth pages
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects || event.url;
      this.showHeader = !this.isAuthPage(url);
    });

    // Set initial header visibility based on current route
    this.showHeader = !this.isAuthPage(this.router.url);
  }

  private isAuthPage(url: string): boolean {
    return url.startsWith('/login') || url.startsWith('/auth/') || url === '/';
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
