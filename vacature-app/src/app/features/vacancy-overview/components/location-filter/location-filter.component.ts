import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatChip, MatChipSet, MatChipRemove } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { FilterService } from '../../../../core/services/filter.service';
import { VacancyService } from '../../../../core/services/vacancy.service';

@Component({
  selector: 'app-location-filter',
  standalone: true,
  imports: [MatFormField, MatLabel, MatSelect, MatOption, MatChipSet, MatChip, MatChipRemove, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location-filter.component.html',
  styleUrl: './location-filter.component.scss',
})
export class LocationFilterComponent {
  readonly filterService = inject(FilterService);
  private readonly vacancyService = inject(VacancyService);

  readonly locations = computed(() => this.vacancyService.getAllLocations());

  onChange(event: MatSelectChange): void {
    this.filterService.locations.set(event.value ?? []);
  }
}
