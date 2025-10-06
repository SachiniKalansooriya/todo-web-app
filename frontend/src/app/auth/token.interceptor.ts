import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  
  if (!token) return next(req);
  
  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  
  return next(cloned);
};