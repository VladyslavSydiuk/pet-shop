import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../shared/material.module';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-protected-demo',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="protected-container">
      <h2>Protected Demo</h2>
      <p>Click to call a protected API: <code>{{ base }}/api/products</code></p>
      <button mat-raised-button color="primary" (click)="callApi()" [disabled]="loading()">{{ loading() ? 'Loading...' : 'Call API' }}</button>
      <div class="result" *ngIf="result() as r">
        <h3>Result</h3>
        <pre>{{ r | json }}</pre>
      </div>
      <div class="error" *ngIf="error()">{{ error() }}</div>
    </div>
  `,
  styles: [`
    .protected-container { max-width: 720px; margin: 2rem auto; padding: 1.5rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
    .result { margin-top: 1rem; }
    .error { color: #c62828; margin-top: 1rem; }
    code { background: #f5f5f5; padding: 0 .25rem; border-radius: 3px; }
  `]
})
export class ProtectedDemoComponent {
  private http = inject(HttpClient);
  base = environment.apiBaseUrl;

  loading = signal(false);
  result = signal<any>(null);
  error = signal<string | null>(null);

  callApi() {
    this.loading.set(true);
    this.result.set(null);
    this.error.set(null);
    this.http.get(`${this.base}/api/products`).subscribe({
      next: (data) => { this.loading.set(false); this.result.set(data); },
      error: (err) => { this.loading.set(false); this.error.set(err?.message || 'Request failed'); }
    });
  }
}
