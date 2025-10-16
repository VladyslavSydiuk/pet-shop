import { Routes } from '@angular/router';
import {ProductsPageComponent} from './features/products/products-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', canActivate: [authGuard], component: ProductsPageComponent },
  { path: 'products', canActivate: [authGuard], component: ProductsPageComponent },
  { path: 'login', loadComponent: () => import('./features/auth/login-page.component').then(m => m.LoginPageComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup-page.component').then(m => m.SignupPageComponent) },
  { path: 'protected', canActivate: [authGuard], loadComponent: () => import('./features/protected/protected-demo.component').then(m => m.ProtectedDemoComponent) },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail-page.component').then(m => m.ProductDetailPageComponent)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cart/cart-page.component').then(m => m.CartPageComponent)
  },
  { path: '**', redirectTo: '' }
];
