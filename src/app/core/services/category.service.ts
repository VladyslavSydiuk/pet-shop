import {Injectable, signal} from '@angular/core';
import {Category} from '../models/category.model'; // Це може знадобитися для інших методів, тут не використовується напряму для унікальних категорій
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators'; // !!! Важливо імпортувати оператор map

@Injectable({providedIn: 'root'})
export class CategoryService{

  private readonly apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  getUniqueCategories(): Observable<string[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => {
        // 1. Збираємо всі назви категорій з усіх продуктів
        const allCategoryNames = products.map(product => product.category);

        // 2. Використовуємо Set для отримання лише унікальних назв категорій
        const uniqueCategoryNames = new Set(allCategoryNames);

        // 3. Перетворюємо Set назад у масив рядків
        return Array.from(uniqueCategoryNames);
      })
    );
  }


  getCategoryById(id: number): Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }
}
