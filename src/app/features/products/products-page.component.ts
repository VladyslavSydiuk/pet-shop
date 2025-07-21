import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {ProductService} from '../../core/services/product.service';
import {CategoryService} from '../../core/services/category.service';
import { MatSelectModule } from '@angular/material/select';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { Product } from '../../core/models/product.model';
import { switchMap, tap } from 'rxjs/operators';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, MaterialModule, MatSelectModule, FormsModule, MatPaginatorModule],
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

  // Property for ngModel binding
  searchValue = '';

  // Signal for reactivity
  searchQuery = signal('');

  // Pagination signals
  pageIndex = signal(0);
  pageSize = signal(20);
  totalItems = signal(0);

  // Category signal
  selectedCategory = signal<string | null>(null);

  categories = toSignal(this.categoryService.getUniqueCategories(), {initialValue: []});

  // Create a computed signal that depends on pagination, search, and category values
  paginationParams = computed(() => ({
    page: this.pageIndex(),
    size: this.pageSize(),
    categoryName: this.selectedCategory() || 'all'
  }));

  // Use the computed signal as a dependency to automatically refetch when any parameter changes
  productsPage = toSignal(
    toObservable(computed(() => this.paginationParams())).pipe(
      switchMap(params => this.productService.getProductsPaginated(params.page, params.size, params.categoryName)),
      tap(page => this.totalItems.set(page.totalElements))
    ),
    { initialValue: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20, first: true, last: true, empty: true, pageable: { pageNumber: 0, pageSize: 20, offset: 0, sort: { empty: true, sorted: false, unsorted: true } } } }
  );

  // Get just the products array from the page - no need for client-side filtering since backend handles it
  products = computed(() => this.productsPage().content);

  // For search functionality, we'll filter on the client side for now
  // You might want to add search to the backend later
  filteredProducts = computed(() => {
    const search = this.searchQuery().toLowerCase();

    if (!search) {
      return this.products();
    }

    return this.products().filter(product =>
      product.productName.toLowerCase().includes(search)
    );
  });

  onCategoryChange(category: string | null) {
    this.selectedCategory.set(category);
    // Reset to first page when category changes
    this.pageIndex.set(0);
  }

  updateSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  // Handler for pagination events
  handlePageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
