import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatChipListbox, MatChipOption, MatChipListboxChange } from '@angular/material/chips';
import { FilterService } from '../../../../core/services/filter.service';
import { VacancyService } from '../../../../core/services/vacancy.service';

@Component({
  selector: 'app-scale-filter',
  standalone: true,
  imports: [MatChipListbox, MatChipOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scale-filter.component.html',
  styleUrl: './scale-filter.component.scss',
})
export class ScaleFilterComponent {
  readonly filterService = inject(FilterService);
  private readonly vacancyService = inject(VacancyService);

  readonly scales = computed(() => this.vacancyService.getAllScales());

  onChange(event: MatChipListboxChange): void {
    this.filterService.scale.set(event.value ?? null);
  }
}
