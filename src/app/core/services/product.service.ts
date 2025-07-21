import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly apiUrl = 'http://localhost:8090/products';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsPaginated(page: number = 0, size: number = 20, categoryName: string = 'all'): Observable<Page<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('categoryName', categoryName);

    return this.http.get<Page<Product>>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
