import {Injectable} from '@angular/core';
import {Category} from '../models/category.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class CategoryService{

  private readonly apiUrl = `${environment.apiBaseUrl}/api/categories`;

  constructor(private http: HttpClient) {}

  getUniqueCategories(): Observable<string[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map(categories => {


        // 1. Збираємо всі назви категорій з усіх продуктів
        const allCategoryNames = categories.map(category => category.name);

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
