import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Vacancy } from '../../../../core/models/vacancy.model';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-vacancy-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card" [routerLink]="['/vacatures', vacancy().id]">
      <div class="card-header">
        <div class="card-meta">
          <app-badge [variant]="vacancy().personnelType === 'military' ? 'military' : 'civilian'">
            {{ vacancy().personnelType === 'military' ? 'Militair' : 'Burger' }}
          </app-badge>
          <app-badge variant="domain">{{ vacancy().functionDomain }}</app-badge>
        </div>
        <div class="card-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>

      <h3 class="card-title">{{ vacancy().title }}</h3>
      <p class="card-dept">{{ vacancy().department }}</p>

      <div class="card-details">
        @if (vacancy().rank) {
          <span class="detail-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {{ vacancy().rank }}
          </span>
        }
        @if (vacancy().scale) {
          <span class="detail-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {{ vacancy().scale }}
          </span>
        }
        <span class="detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {{ vacancy().locations.join(', ') }}
        </span>
      </div>

      <div class="card-footer">
        <span class="view-link">Bekijk vacature</span>
      </div>
    </article>
  `,
  styles: [`
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 1.25rem;
      cursor: pointer;
      border: 1px solid #E2E8F0;
      transition: box-shadow 0.2s, transform 0.15s, border-color 0.2s;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
    }
    .card:hover {
      box-shadow: 0 8px 24px rgba(15,35,66,0.12);
      transform: translateY(-2px);
      border-color: #94A3B8;
    }
    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }
    .card-arrow {
      color: #94A3B8;
      flex-shrink: 0;
      transition: color 0.15s, transform 0.15s;
    }
    .card:hover .card-arrow {
      color: #0F2342;
      transform: translateX(3px);
    }
    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #0F2342;
      margin: 0.375rem 0 0;
      line-height: 1.3;
    }
    .card-dept {
      font-size: 0.8125rem;
      color: #64748B;
      margin: 0;
    }
    .card-details {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      margin-top: 0.375rem;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.8125rem;
      color: #475569;
    }
    .card-footer {
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid #F1F5F9;
    }
    .view-link {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #0F2342;
      transition: color 0.15s;
    }
    .card:hover .view-link {
      color: #F59E0B;
    }
  `]
})
export class VacancyCardComponent {
  readonly vacancy = input.required<Vacancy>();
}
