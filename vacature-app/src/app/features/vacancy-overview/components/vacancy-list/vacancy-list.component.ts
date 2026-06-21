import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FilterService } from '../../../../core/services/filter.service';
import { VacancyService } from '../../../../core/services/vacancy.service';
import { VacancyGroupComponent } from '../vacancy-group/vacancy-group.component';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  imports: [VacancyGroupComponent, MatButton, MatIcon, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vacancy-list.component.html',
  styleUrl: './vacancy-list.component.scss',
})
export class VacancyListComponent {
  readonly filterService = inject(FilterService);
  readonly vacancyService = inject(VacancyService);
  readonly collapsedSections = signal<string[]>([]);

  sectionCount(section: { groups: { vacancies: unknown[] }[] }): number {
    return section.groups.reduce((acc, g) => acc + g.vacancies.length, 0);
  }

  isCollapsed(title: string): boolean {
    return this.collapsedSections().includes(title);
  }

  toggleSection(title: string): void {
    const current = this.collapsedSections();
    this.collapsedSections.set(
      current.includes(title) ? current.filter(s => s !== title) : [...current, title]
    );
  }
}
