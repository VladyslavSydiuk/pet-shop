import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  // Two signals to support binding display value and the effective query (if you need to debounce later)
  readonly searchValue = signal<string>('');
  readonly searchQuery = signal<string>('');

  setSearch(value: string) {
    this.searchValue.set(value);
    this.searchQuery.set(value);
  }

  clear() {
    this.setSearch('');
  }
}
