import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent {
  protected cart = inject(CartService);

  readonly items = this.cart.items;
  readonly count = this.cart.count;
  readonly total = this.cart.total;

  onImgError(e: Event) {
    const target = e.target as HTMLImageElement | null;
    if (target && target.src !== 'https://placehold.co/80x60') {
      target.src = 'https://placehold.co/80x60';
    }
  }

  toImageUrl(raw: string | null | undefined): string {
    if (!raw) return 'https://placehold.co/80x60?text=No+Image';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/assets/') || raw.startsWith('assets/')) return raw.startsWith('/') ? raw : `/${raw}`;
    if (raw.startsWith('/static/') || raw.startsWith('static/')) {
      const path = raw.startsWith('/') ? raw : `/${raw}`;
      return `${environment.apiBaseUrl}${path}`;
    }
    const filename = raw.split('/') .pop() ?? raw;
    return `${environment.apiBaseUrl}/static/${filename}`;
  }

  inc(id: number) {
    const item = this.items().find(i => i.product.id === id);
    if (item) this.cart.setQuantity(id, item.quantity + 1);
  }

  dec(id: number) {
    const item = this.items().find(i => i.product.id === id);
    if (!item) return;
    const next = item.quantity - 1;
    if (next <= 0) this.cart.remove(id); else this.cart.setQuantity(id, next);
  }

  remove(id: number) { this.cart.remove(id); }
  clear() { this.cart.clear(); }

  checkout() {
    // Placeholder — will be implemented with backend order API
    alert('Checkout is not implemented yet. See backend requirements in README.');
  }
}
