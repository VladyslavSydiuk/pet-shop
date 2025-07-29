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
import { switchMap, tap, debounceTime } from 'rxjs/operators';
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
    categoryName: this.selectedCategory() || 'all',
    searchTerm: this.searchQuery() // Додаємо пошуковий запит в параметри
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

  onCategoryChange(category: string | null) {
    this.selectedCategory.set(category);
    // Reset to first page when category changes
    this.pageIndex.set(0);
  }

  updateSearchQuery(query: string) {
    this.searchQuery.set(query);
    // Reset to first page when search query changes
    this.pageIndex.set(0);
  }

  // Handler for pagination events
  handlePageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
