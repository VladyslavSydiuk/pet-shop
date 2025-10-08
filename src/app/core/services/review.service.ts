import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/products`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/${productId}/reviews`);
  }

  addReview(productId: number, payload: { rating: number; comment: string }): Observable<Review> {
    const username = this.auth.getCurrentUsername();
    let headers = new HttpHeaders();
    if (username) {
      headers = headers.set('X-User-Name', username);
    }
    return this.http.post<Review>(`${this.baseUrl}/${productId}/reviews`, payload, { headers });
  }
}
