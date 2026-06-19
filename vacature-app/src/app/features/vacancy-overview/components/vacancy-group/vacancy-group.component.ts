import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { VacancyGroup } from '../../../../core/models/filter.model';
import { VacancyCardComponent } from '../vacancy-card/vacancy-card.component';

@Component({
  selector: 'app-vacancy-group',
  standalone: true,
  imports: [VacancyCardComponent, MatChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vacancy-group.component.html',
  styleUrl: './vacancy-group.component.scss',
})
export class VacancyGroupComponent {
  readonly group = input.required<VacancyGroup>();
}
