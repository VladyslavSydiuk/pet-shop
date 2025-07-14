import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {ProductService} from '../../core/services/product.service';
import {CategoryService} from '../../core/services/category.service';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, MaterialModule,MatSelectModule],
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

  products = toSignal(this.productService.getProducts(), {initialValue: []});
  categories = toSignal(this.categoryService.getUniqueCategories(), {initialValue: []});

  //signal to save currently selected category
  selectedCategory = signal<string | null>(null);

  filteredProducts = computed(() => {
    const selected = this.selectedCategory();
    return selected
      ? this.products().filter(product => product.category === selected)
      : this.products();
  });

  onCategoryChange(category: string) {
    this.selectedCategory.set(category || null);
  }
}
