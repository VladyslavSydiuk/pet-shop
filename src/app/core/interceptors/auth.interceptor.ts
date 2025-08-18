import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const TOKEN_KEY = 'auth_token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const base = environment.apiBaseUrl;

  let authReq = req;
  const token = localStorage.getItem(TOKEN_KEY);

  // Attach Authorization only for protected endpoints: `${API_BASE}/api/**`
  const isProtected = req.url.startsWith(`${base}/api/`);
  if (token && isProtected) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Do not auto-redirect on auth endpoints (login/register)
      const isAuthEndpoint = req.url.startsWith(`${base}/users/`);
      if (isAuthEndpoint) {
        return throwError(() => error);
      }

      if (error?.status === 401 || error?.status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
