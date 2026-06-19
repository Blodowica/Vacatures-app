import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatChipListbox, MatChipOption, MatChipListboxChange } from '@angular/material/chips';
import { FilterService } from '../../../../core/services/filter.service';
import { VacancyService } from '../../../../core/services/vacancy.service';

@Component({
  selector: 'app-function-domain-filter',
  standalone: true,
  imports: [MatChipListbox, MatChipOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './function-domain-filter.component.html',
  styleUrl: './function-domain-filter.component.scss',
})
export class FunctionDomainFilterComponent {
  readonly filterService = inject(FilterService);
  private readonly vacancyService = inject(VacancyService);

  readonly domains = computed(() => this.vacancyService.getAllDomains());

  onChange(event: MatChipListboxChange): void {
    const val = event.value;
    this.filterService.functionDomain.set(Array.isArray(val) ? val : val ? [val] : []);
  }
}
