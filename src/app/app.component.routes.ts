import { Routes } from '@angular/router';
import {ProductsPageComponent} from './features/products/products-page.component';

export const routes: Routes = [
  { path: '', component: ProductsPageComponent },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail-page.component').then(m => m.ProductDetailPageComponent)
  },
  { path: '**', redirectTo: '' }
];
