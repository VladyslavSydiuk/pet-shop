import { Injectable, signal } from '@angular/core';
import {Product} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>([
    { id: 1, title: 'Собача їжа', price: 100, description: 'Собача їжа', category: "Корм", image:"" },
    { id: 2, title: 'Котячий корм', price: 80, description: 'Котячий корм', category: "Корм", image:"" },
    { id: 3, title: 'Акваріум', price: 500, description: 'Акваріум', category: "Прилади", image:"" },
    { id: 4, title: 'Іграшка для кота', price: 80, description: 'Іграшка для кота', category: "Другі", image:"" },
    { id: 5, title: 'Преміум корм для собак', price: 150, description: 'Високоякісний корм для собак', category: "Корм", image:"" },
    { id: 6, title: 'Вітаміни для кішок', price: 120, description: 'Вітамінні добавки для котів', category: "Другі", image:"" },
    { id: 7, title: 'Фільтр для акваріума', price: 300, description: 'Водний фільтр', category: "Прилади", image:"" },
  ]);

  getProducts() {
    return this._products.asReadonly();
  }
}
