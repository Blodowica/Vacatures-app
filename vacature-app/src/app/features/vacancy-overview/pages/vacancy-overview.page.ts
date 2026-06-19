import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '../../../core/services/filter.service';
import { VacancyFiltersComponent } from '../components/vacancy-filters/vacancy-filters.component';
import { VacancyGroupComponent } from '../components/vacancy-group/vacancy-group.component';

@Component({
  selector: 'app-vacancy-overview',
  standalone: true,
  imports: [VacancyFiltersComponent, VacancyGroupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="page-inner">
        <aside class="sidebar">
          <div class="sidebar-inner">
            <app-vacancy-filters />
          </div>
        </aside>

        <div class="content">
          <div class="content-header">
            <div>
              <h1 class="page-title">Vacatures</h1>
              <p class="page-subtitle">{{ filterService.totalCount() }} {{ filterService.totalCount() === 1 ? 'vacature' : 'vacatures' }} gevonden</p>
            </div>
          </div>

          @if (filterService.totalCount() === 0) {
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <h3>Geen vacatures gevonden</h3>
              <p>Pas je filters aan om meer resultaten te zien.</p>
              <button class="reset-link" (click)="filterService.resetFilters()">Alle filters wissen</button>
            </div>
          } @else {
            @for (section of filterService.sections(); track section.personnelType + section.sectionTitle) {
              @if (section.sectionTitle) {
                <div class="section-header">
                  <div class="section-indicator" [class.military]="section.personnelType === 'military'" [class.civilian]="section.personnelType === 'civilian'"></div>
                  <h2 class="section-title">{{ section.sectionTitle }}</h2>
                </div>
              }
              @for (group of section.groups; track group.label) {
                <app-vacancy-group [group]="group" />
              }
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: 1.5rem;
    }
    .page-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 2rem;
      align-items: start;
    }
    .sidebar {
      position: sticky;
      top: 80px;
    }
    .sidebar-inner {
      background: #fff;
      border-radius: 12px;
      padding: 1.25rem;
      border: 1px solid #E2E8F0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .content {}
    .content-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0F2342;
      margin: 0 0 0.25rem;
      letter-spacing: -0.03em;
    }
    .page-subtitle {
      font-size: 0.875rem;
      color: #64748B;
      margin: 0;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 1.5rem 0 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #0F2342;
    }
    .section-indicator {
      width: 4px;
      height: 24px;
      border-radius: 2px;
    }
    .section-indicator.military { background: #F59E0B; }
    .section-indicator.civilian { background: #14B8A6; }
    .section-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0F2342;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      color: #64748B;
      gap: 0.75rem;
    }
    .empty-state h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #374151;
      margin: 0;
    }
    .empty-state p { margin: 0; font-size: 0.875rem; }
    .reset-link {
      margin-top: 0.5rem;
      padding: 0.5rem 1.25rem;
      background: #0F2342;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .reset-link:hover { background: #1E3A5F; }
    @media (max-width: 768px) {
      .page { padding: 1rem; }
      .page-inner { grid-template-columns: 1fr; }
      .sidebar { position: static; }
    }
  `]
})
export class VacancyOverviewPage {
  readonly filterService = inject(FilterService);
}
