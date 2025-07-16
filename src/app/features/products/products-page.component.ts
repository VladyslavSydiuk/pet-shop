import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {ProductService} from '../../core/services/product.service';
import {CategoryService} from '../../core/services/category.service';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, MaterialModule, MatSelectModule, FormsModule],
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

  products = toSignal(this.productService.getProducts(), {initialValue: []});
  categories = toSignal(this.categoryService.getUniqueCategories(), {initialValue: []});

  //signal to save currently selected category
  selectedCategory = signal<string | null>(null);

  filteredProducts = computed(() => {
    const selected = this.selectedCategory();
    const search = this.searchQuery().toLowerCase();

    return this.products().filter(product =>
      (!selected || product.category === selected) &&
      (!search || product.title.toLowerCase().includes(search))
    );
  });

  onCategoryChange(category: string | null) {
    this.selectedCategory.set(category);
  }

  updateSearchQuery(query: string) {
    this.searchQuery.set(query);
  }
}
