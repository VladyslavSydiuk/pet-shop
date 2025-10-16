import {Component, computed, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {ProductService} from '../../core/services/product.service';
import {CategoryService} from '../../core/services/category.service';
import { MatSelectModule } from '@angular/material/select';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { switchMap, tap, debounceTime } from 'rxjs/operators';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { RatingService, RatingSummary } from '../../core/services/rating.service';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { Observable } from 'rxjs';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, MaterialModule, MatSelectModule, FormsModule, MatPaginatorModule, RouterModule, StarRatingComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ])
    ])
  ]
})
export class ProductsPageComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private ratingService = inject(RatingService);
  protected search = inject(SearchService);
  private cart = inject(CartService);

  // Current user display info
  username = this.authService.getCurrentUsername();
  email = this.authService.getCurrentEmail();

  // Property for ngModel binding
  // moved to shared SearchService

  // Signal for reactivity
  // use shared SearchService signal

  // Pagination signals
  pageIndex = signal(0);
  pageSize = signal(20);
  totalItems = signal(0);

  // Category signal
  selectedCategory = signal<string | null>(null);

  categories = toSignal(this.categoryService.getUniqueCategories(), {initialValue: []});

  // Reset to first page when the global search query changes (from shared header)
  private readonly _resetOnSearchChange = effect(() => {
    const _q = this.search.searchQuery();
    this.pageIndex.set(0);
  });

  // Create a computed signal that depends on pagination, search, and category values
  paginationParams = computed(() => ({
    page: this.pageIndex(),
    size: this.pageSize(),
    categoryName: this.selectedCategory() || 'all',
    searchTerm: this.search.searchQuery() // Додаємо пошуковий запит в параметри
  }));

  // Use the computed signal as a dependency to automatically refetch when any parameter changes
  productsPage = toSignal(
    toObservable(computed(() => this.paginationParams())).pipe(
      debounceTime(300), // Додаємо debounce для зменшення частоти запитів під час швидкого введення
      switchMap(params => this.productService.getProductsPaginated(
        params.page,
        params.size,
        params.categoryName,
        params.searchTerm
      )),
      tap(page => this.totalItems.set(page.totalElements))
    ),
    { initialValue: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20, first: true, last: true, empty: true, pageable: { pageNumber: 0, pageSize: 20, offset: 0, sort: { empty: true, sorted: false, unsorted: true } } } }
  );

  // Отримуємо товари прямо з результату запиту до сервера
  products = computed(() => this.productsPage().content);

  // Більше не потрібна фільтрація на клієнті, оскільки вона виконується на сервері
  // Просто використовуємо products як є
  filteredProducts = this.products;

  logout() {
    this.authService.logout();
  }

  onCategoryChange(category: string | null) {
    this.selectedCategory.set(category);
    // Reset to first page when category changes
    this.pageIndex.set(0);
  }

  // search query now updated via shared header; reset page when it changes
  // Consumers can watch search.searchQuery() changes to reset page if needed elsewhere

  // Handler for pagination events
  handlePageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  // Replace broken images with a placeholder
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    const fallback = 'https://placehold.co/300x200?text=No+Image';
    if (img && img.src !== fallback) {
      img.src = fallback;
    }
  }

  // Normalize DB-stored image paths to browser-usable URLs
  toImageUrl(raw: string | null | undefined): string {
    const fallback = 'https://placehold.co/300x200?text=No+Image';
    if (!raw) return fallback;

    // Already absolute HTTP(S)
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

    // Frontend asset path
    if (raw.startsWith('/assets/') || raw.startsWith('assets/')) {
      return raw.startsWith('/') ? raw : `/${raw}`;
    }

    // Common backend-relative paths like "static/..." → map to backend base
    // Keep any leading slash handling consistent
    if (raw.startsWith('/static/') || raw.startsWith('static/')) {
      const path = raw.startsWith('/') ? raw : `/${raw}`;
      return `${environment.apiBaseUrl}${path}`;
    }

    // Fallback: treat as filename and serve from backend static root
    const filename = raw.split('/').pop() ?? raw;
    return `${environment.apiBaseUrl}/static/${filename}`;
  }

  // Expose rating summary observable for templates (shared replayed in service)
  getRatingSummary(productId: number): Observable<RatingSummary> {
    return this.ratingService.getSummary(productId);
  }

  // Buy button enabled if: status is AVAILABLE or missing, and stock is null/undefined or > 0
  isBuyEnabled(p: Product): boolean {
    const statusOk = !p.productStatus || p.productStatus === 'AVAILABLE';
    const stockOk = p.stock == null || p.stock > 0;
    return statusOk && stockOk;
  }

  addToCart(p: Product) {
    if (!this.isBuyEnabled(p)) return;
    this.cart.add(p, 1);
  }
}
