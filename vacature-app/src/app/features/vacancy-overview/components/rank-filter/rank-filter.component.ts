import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatChipListbox, MatChipOption, MatChipListboxChange } from '@angular/material/chips';
import { FilterService } from '../../../../core/services/filter.service';
import { VacancyService } from '../../../../core/services/vacancy.service';

@Component({
  selector: 'app-rank-filter',
  standalone: true,
  imports: [MatChipListbox, MatChipOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rank-filter.component.html',
  styleUrl: './rank-filter.component.scss',
})
export class RankFilterComponent {
  readonly filterService = inject(FilterService);
  private readonly vacancyService = inject(VacancyService);

  readonly ranks = computed(() => this.vacancyService.getAllRanks());

  onChange(event: MatChipListboxChange): void {
    this.filterService.rank.set(event.value ?? null);
  }
}
