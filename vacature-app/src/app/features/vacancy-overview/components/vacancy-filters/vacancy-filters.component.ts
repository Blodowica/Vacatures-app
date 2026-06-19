import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '../../../../core/services/filter.service';
import { VacancyService } from '../../../../core/services/vacancy.service';
import { PersonnelType } from '../../../../core/models/vacancy.model';

@Component({
  selector: 'app-vacancy-filters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="filters">
      <div class="filter-section">
        <h4 class="filter-label">Personeelstype</h4>
        <div class="type-tabs">
          @for (type of personnelTypes; track type.value) {
            <button
              class="type-tab"
              [class.active]="filterService.personnelType() === type.value"
              (click)="filterService.setPersonnelType(type.value)"
            >{{ type.label }}</button>
          }
        </div>
      </div>

      @if (filterService.personnelType() === 'military' || filterService.personnelType() === 'all') {
        <div class="filter-section">
          <h4 class="filter-label">Rang</h4>
          <div class="chip-list">
            @for (rank of vacancyService.getAllRanks(); track rank) {
              <button
                class="chip"
                [class.active]="filterService.rank() === rank"
                (click)="toggleRank(rank)"
              >{{ rank }}</button>
            }
          </div>
        </div>
      }

      @if (filterService.personnelType() === 'civilian' || filterService.personnelType() === 'all') {
        <div class="filter-section">
          <h4 class="filter-label">Schaal</h4>
          <div class="chip-list">
            @for (scale of vacancyService.getAllScales(); track scale) {
              <button
                class="chip"
                [class.active]="filterService.scale() === scale"
                (click)="toggleScale(scale)"
              >{{ scale }}</button>
            }
          </div>
        </div>
      }

      <div class="filter-section">
        <h4 class="filter-label">Functiedomein</h4>
        <div class="chip-list">
          @for (domain of vacancyService.getAllDomains(); track domain) {
            <button
              class="chip"
              [class.active]="filterService.functionDomain() === domain"
              (click)="toggleDomain(domain)"
            >{{ domain }}</button>
          }
        </div>
      </div>

      <div class="filter-section">
        <h4 class="filter-label">Locatie</h4>
        <div class="chip-list">
          @for (location of vacancyService.getAllLocations(); track location) {
            <button
              class="chip"
              [class.active]="filterService.locations().includes(location)"
              (click)="filterService.toggleLocation(location)"
            >{{ location }}</button>
          }
        </div>
      </div>

      @if (hasActiveFilters()) {
        <button class="reset-btn" (click)="filterService.resetFilters()">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
          </svg>
          Filters wissen
        </button>
      }
    </aside>
  `,
  styles: [`
    .filters {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .filter-section {}
    .filter-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 0.625rem;
    }
    .type-tabs {
      display: flex;
      background: #F1F5F9;
      border-radius: 8px;
      padding: 3px;
      gap: 2px;
    }
    .type-tab {
      flex: 1;
      padding: 0.4rem 0.5rem;
      border: none;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      background: transparent;
      color: #64748B;
      transition: background 0.15s, color 0.15s;
    }
    .type-tab.active {
      background: #0F2342;
      color: #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    }
    .type-tab:hover:not(.active) {
      background: #E2E8F0;
      color: #0F2342;
    }
    .chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }
    .chip {
      padding: 0.3rem 0.7rem;
      border: 1.5px solid #E2E8F0;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      background: #fff;
      color: #475569;
      transition: all 0.15s;
    }
    .chip:hover {
      border-color: #0F2342;
      color: #0F2342;
    }
    .chip.active {
      background: #0F2342;
      border-color: #0F2342;
      color: #fff;
    }
    .reset-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      border: 1.5px solid #E2E8F0;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      background: #fff;
      color: #EF4444;
      border-color: #FEE2E2;
      transition: all 0.15s;
      align-self: flex-start;
    }
    .reset-btn:hover {
      background: #FEF2F2;
      border-color: #FCA5A5;
    }
  `]
})
export class VacancyFiltersComponent {
  readonly filterService = inject(FilterService);
  readonly vacancyService = inject(VacancyService);

  readonly personnelTypes: { value: PersonnelType | 'all'; label: string }[] = [
    { value: 'all', label: 'Alles' },
    { value: 'military', label: 'Militair' },
    { value: 'civilian', label: 'Burger' },
  ];

  hasActiveFilters(): boolean {
    const f = this.filterService.activeFilter();
    return f.personnelType !== 'all' || !!f.rank || !!f.scale || !!f.functionDomain || f.locations.length > 0;
  }

  toggleRank(rank: string): void {
    this.filterService.rank.set(this.filterService.rank() === rank ? null : rank);
  }

  toggleScale(scale: string): void {
    this.filterService.scale.set(this.filterService.scale() === scale ? null : scale);
  }

  toggleDomain(domain: string): void {
    this.filterService.functionDomain.set(this.filterService.functionDomain() === domain ? null : domain);
  }
}
