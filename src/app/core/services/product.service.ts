import { Injectable, signal } from '@angular/core';
import {Product} from '../models/product.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}


  getProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
