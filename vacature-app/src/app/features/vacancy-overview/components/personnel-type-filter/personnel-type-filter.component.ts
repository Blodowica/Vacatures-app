import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { FilterService } from '../../../../core/services/filter.service';
import { PersonnelType } from '../../../../core/models/vacancy.model';

const OPTIONS: { value: PersonnelType | 'all'; label: string }[] = [
  { value: 'all',      label: 'Alles'    },
  { value: 'military', label: 'Militair' },
  { value: 'civilian', label: 'Burger'   },
];

@Component({
  selector: 'app-personnel-type-filter',
  standalone: true,
  imports: [MatButtonToggleGroup, MatButtonToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personnel-type-filter.component.html',
  styleUrl: './personnel-type-filter.component.scss',
})
export class PersonnelTypeFilterComponent {
  readonly filterService = inject(FilterService);
  readonly options = OPTIONS;

  onChange(event: MatButtonToggleChange): void {
    this.filterService.setPersonnelType(event.value);
  }
}
