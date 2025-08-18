import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MaterialModule],
  template: `
    <div class="auth-container">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill" class="full">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" required />
          <mat-error *ngIf="form.controls.username.invalid && form.controls.username.touched">Required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required />
          <mat-error *ngIf="form.controls.password.invalid && form.controls.password.touched">Min 6 chars</mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Signing in...' : 'Login' }}
        </button>
        <a routerLink="/signup" style="margin-left: 1rem">Create account</a>

        <div class="error" *ngIf="error()">{{ error() }}</div>
      </form>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 420px; margin: 2rem auto; padding: 1.5rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
    .full { width: 100%; }
    .error { color: #c62828; margin-top: 1rem; }
  `]
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { username, password } = this.form.getRawValue();
    this.auth.login({ username: username!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.error.set(err.message || 'Login failed');
      }
    });
  }
}
