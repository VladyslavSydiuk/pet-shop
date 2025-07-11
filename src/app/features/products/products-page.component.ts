import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductService} from '../../core/services/product.service';
import {CategoryService} from '../../core/services/category.service';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = this.productService.getProducts();
  categories = this.categoryService.getCategories()

  //signal to save currently selected category
  selectedCategory = signal<string | null>(null);

  filteredProducts = computed(() => {
    const selected = this.selectedCategory();
    return selected
      ? this.products().filter(product => product.category === selected)
      : this.products();
  });

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(value || null);
  }
}
