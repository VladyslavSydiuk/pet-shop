import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  productId: string | null = null;



  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    // Here you would typically fetch the product details using the ID
  }

  goBack(): void {
    window.history.back();
  }
}
