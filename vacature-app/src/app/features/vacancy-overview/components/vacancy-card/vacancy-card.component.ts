import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { Vacancy } from '../../../../core/models/vacancy.model';

@Component({
  selector: 'app-vacancy-card',
  standalone: true,
  imports: [RouterLink, MatCard, MatCardContent, MatChipSet, MatChip, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vacancy-card.component.html',
  styleUrl: './vacancy-card.component.scss',
})
export class VacancyCardComponent {
  readonly vacancy = input.required<Vacancy>();
}
