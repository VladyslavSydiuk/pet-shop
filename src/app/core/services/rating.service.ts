import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ReviewService } from './review.service';

export interface RatingSummary {
  avg: number;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class RatingService {
  private cache = new Map<number, Observable<RatingSummary>>();

  constructor(private reviews: ReviewService) {}

  getSummary(productId: number): Observable<RatingSummary> {
    if (!this.cache.has(productId)) {
      const obs = this.reviews.getReviews(productId).pipe(
        map(list => {
          const count = list.length;
          const avg = count ? list.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;
          // keep one decimal
          return { avg: Math.round(avg * 10) / 10, count } as RatingSummary;
        }),
        shareReplay(1)
      );
      this.cache.set(productId, obs);
    }
    return this.cache.get(productId)!;
  }
}
