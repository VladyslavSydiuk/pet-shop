import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  @Input() value = 0; // current rating
  @Input() max = 5;   // max stars
  @Input() readonly = false;
  @Output() rated = new EventEmitter<number>();

  hovered = 0;

  stars(): number[] {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }

  displayValue(): number {
    return this.hovered || this.value;
  }

  setRating(v: number) {
    if (this.readonly) return;
    this.value = v;
    this.rated.emit(v);
  }

  onMouseEnter(v: number) {
    if (this.readonly) return;
    this.hovered = v;
  }

  onMouseLeave() {
    if (this.readonly) return;
    this.hovered = 0;
  }
}
