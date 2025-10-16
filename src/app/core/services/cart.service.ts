import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'petshop_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(this.readFromStorage());

  // public signals
  readonly items = computed(() => this._items());
  readonly count = computed(() => this._items().reduce((sum, it) => sum + it.quantity, 0));
  readonly total = computed(() => this._items().reduce((sum, it) => sum + it.quantity * (it.product.price || 0), 0));

  add(product: Product, qty: number = 1) {
    if (!product) return;
    const items = [...this._items()];
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
    } else {
      items.push({ product, quantity: Math.max(1, qty) });
    }
    this._items.set(items);
    this.persist();
  }

  setQuantity(productId: number, qty: number) {
    if (qty <= 0) return this.remove(productId);
    const items = this._items().map(it => it.product.id === productId ? { ...it, quantity: qty } : it);
    this._items.set(items);
    this.persist();
  }

  remove(productId: number) {
    const items = this._items().filter(it => it.product.id !== productId);
    this._items.set(items);
    this.persist();
  }

  clear() {
    this._items.set([]);
    this.persist();
  }

  private persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items())); } catch {}
  }

  private readFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
      return [];
    }
  }
}
