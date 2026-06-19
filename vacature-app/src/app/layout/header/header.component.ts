import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <div class="header-inner">
        <a routerLink="/" class="brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#0F2342"/>
            <path d="M8 22L16 8L24 22H8Z" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linejoin="round"/>
            <circle cx="16" cy="16" r="3" fill="#F59E0B"/>
          </svg>
          <span class="brand-name">Vacancy<span class="brand-accent">Explorer</span></span>
        </a>

        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            class="search-input"
            placeholder="Zoek vacature, afdeling of domein..."
            [ngModel]="filterService.searchQuery()"
            (ngModelChange)="filterService.searchQuery.set($event)"
            aria-label="Vacatures zoeken"
          />
        </div>

        <nav class="header-nav">
          <a routerLink="/" class="nav-link">Vacatures</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: #0F2342;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 2px 12px rgba(0,0,0,0.2);
    }
    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.02em;
    }
    .brand-accent {
      color: #F59E0B;
    }
    .search-wrapper {
      flex: 1;
      position: relative;
      max-width: 480px;
    }
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94A3B8;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.5rem 1rem 0.5rem 2.5rem;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      color: #fff;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.15s, background 0.15s;
    }
    .search-input::placeholder {
      color: #94A3B8;
    }
    .search-input:focus {
      border-color: #F59E0B;
      background: rgba(255,255,255,0.12);
    }
    .search-input::-webkit-search-cancel-button {
      filter: invert(1);
    }
    .header-nav {
      margin-left: auto;
      display: flex;
      gap: 1rem;
    }
    .nav-link {
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
    }
    .nav-link:hover {
      color: #fff;
      background: rgba(255,255,255,0.08);
    }
    @media (max-width: 640px) {
      .header-nav { display: none; }
      .brand-name { display: none; }
    }
  `]
})
export class HeaderComponent {
  readonly filterService = inject(FilterService);
}
