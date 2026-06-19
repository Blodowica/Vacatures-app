import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FilterService } from '../../../../core/services/filter.service';
import { VacancyGroupComponent } from '../vacancy-group/vacancy-group.component';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [VacancyGroupComponent, MatButton, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vacancy-list.component.html',
  styleUrl: './vacancy-list.component.scss',
})
export class VacancyListComponent {
  readonly filterService = inject(FilterService);

  sectionCount(section: { groups: { vacancies: unknown[] }[] }): number {
    return section.groups.reduce((acc, g) => acc + g.vacancies.length, 0);
  }
}
