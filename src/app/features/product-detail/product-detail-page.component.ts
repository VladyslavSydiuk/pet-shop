import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { ProductService } from '../../core/services/product.service';
import { ReviewService } from '../../core/services/review.service';
import { Product } from '../../core/models/product.model';
import { Review } from '../../core/models/review.model';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { environment } from '../../../environments/environment';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, StarRatingComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private reviewService = inject(ReviewService);
  private cart = inject(CartService);

  productId = signal<number | null>(null);
  product = signal<Product | null>(null);
  reviews = signal<Review[]>([]);

  // form state
  newRating = signal<number>(0);
  newComment = signal<string>('');
  submitting = signal<boolean>(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    this.productId.set(id);
    if (id != null) {
      this.loadProduct(id);
      this.loadReviews(id);
    }
  }

  private loadProduct(id: number) {
    this.productService.getProductById(id).subscribe(p => this.product.set(p));
  }

  private loadReviews(id: number) {
    this.reviewService.getReviews(id).subscribe(list => this.reviews.set(list));
  }

  submitReview() {
    const id = this.productId();
    if (id == null) return;
    const rating = this.newRating();
    const comment = this.newComment().trim();
    if (!rating || rating < 1) return;
    this.submitting.set(true);
    this.reviewService.addReview(id, { rating, comment }).subscribe({
      next: (created) => {
        this.reviews.set([created, ...this.reviews()]);
        this.newRating.set(0);
        this.newComment.set('');
      },
      complete: () => this.submitting.set(false),
      error: () => this.submitting.set(false)
    });
  }

  toImageUrl(raw: string | null | undefined): string {
    if (!raw) return 'https://placehold.co/600x400?text=No+Image';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/assets/') || raw.startsWith('assets/')) return raw.startsWith('/') ? raw : `/${raw}`;
    if (raw.startsWith('/static/') || raw.startsWith('static/')) {
      const path = raw.startsWith('/') ? raw : `/${raw}`;
      return `${environment.apiBaseUrl}${path}`;
    }
    const filename = raw.split('/').pop() ?? raw;
    return `${environment.apiBaseUrl}/static/${filename}`;
  }

  isBuyEnabled(p: Product): boolean {
    const statusOk = !p.productStatus || p.productStatus === 'AVAILABLE';
    const stockOk = p.stock == null || p.stock > 0;
    return statusOk && stockOk;
  }

  addToCart(p: Product) {
    if (!this.isBuyEnabled(p)) return;
    this.cart.add(p, 1);
  }

  goBack(): void { window.history.back(); }
}
