import {Injectable, signal} from '@angular/core';
import {Category} from '../models/category.model';


@Injectable({providedIn: 'root'})
export class CategoryService{
  private readonly _categories = signal<Category[]>([
    { id: 1, name: 'Корм' },
    { id: 2, name: 'Прилади' },
    { id: 3, name: 'Другі' },
  ]);

  getCategories() {
    return this._categories.asReadonly();
  }

}
