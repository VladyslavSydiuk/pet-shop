import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterPayload {
  username: string;
  email?: string | null;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = environment.apiBaseUrl;

  register(data: RegisterPayload): Observable<string> {
    const url = `${this.base}/users/register`;
    return this.http.post(url, data, { responseType: 'text' }).pipe(
      map((text) => text ?? ''),
      catchError((err) => {
        const msg = err?.error ?? 'Registration failed';
        return throwError(() => new Error(typeof msg === 'string' ? msg : 'Registration failed'));
      })
    );
  }

  login(credentials: LoginPayload): Observable<string> {
    const url = `${this.base}/users/login`;
    // Backend returns JWT as plain text
    return this.http.post(url, credentials, { responseType: 'text' }).pipe(
      tap((token) => {
        if (token && typeof token === 'string') {
          localStorage.setItem(TOKEN_KEY, token);
        }
      }),
      map((token) => token ?? ''),
      catchError((err) => {
        // Friendly message for invalid credentials
        if (err?.status === 401 || err?.status === 403) {
          return throwError(() => new Error('Невірний логін або пароль'));
        }
        const raw = err?.error;
        const fallback = 'Login failed';
        const msg = typeof raw === 'string' && raw ? raw : fallback;
        return throwError(() => new Error(msg));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
