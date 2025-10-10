import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MaterialModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  private auth = inject(AuthService);
  protected search = inject(SearchService);
  private router = inject(Router);

  // Display info
  username = this.auth.getCurrentUsername();
  email = this.auth.getCurrentEmail();

  logout() {
    this.auth.logout();
  }

  goToProducts() {
    // Ensure searchQuery reflects latest typed value
    this.search.setSearch(this.search.searchValue());
    this.router.navigate(['/products']);
  }
}
