import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { FilterService } from '../../../core/services/filter.service';
import { FilterPanelComponent } from '../components/filter-panel/filter-panel.component';
import { VacancyListComponent } from '../components/vacancy-list/vacancy-list.component';

@Component({
  selector: 'app-vacancy-overview',
  standalone: true,
  imports: [
    MatButton, MatIcon, MatBadge,
    FilterPanelComponent,
    VacancyListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vacancy-overview.page.html',
  styleUrl: './vacancy-overview.page.scss',
})
export class VacancyOverviewPage {
  readonly filterService = inject(FilterService);
  readonly showMobileFilters = signal(false);

  toggleMobileFilters(): void {
    this.showMobileFilters.update(v => !v);
  }

  closeMobileFilters(): void {
    this.showMobileFilters.set(false);
  }
}
