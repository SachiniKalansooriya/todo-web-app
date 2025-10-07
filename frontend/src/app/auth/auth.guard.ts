import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Verify token is valid by making a request to the server
  return auth.getCurrentUser().pipe(
    map(() => true),
    catchError(() => {
      // Token is invalid, clear it and redirect to login
      localStorage.removeItem('token');
      router.navigate(['/login']);
      return of(false);
    })
  );
};