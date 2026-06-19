import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { VacancyGroup } from '../../../../core/models/filter.model';
import { VacancyCardComponent } from '../vacancy-card/vacancy-card.component';

@Component({
  selector: 'app-vacancy-group',
  standalone: true,
  imports: [VacancyCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="group">
      <div class="group-header">
        <h3 class="group-label">{{ group().label }}</h3>
        <span class="group-count">{{ group().vacancies.length }} {{ group().vacancies.length === 1 ? 'vacature' : 'vacatures' }}</span>
      </div>
      <div class="group-grid">
        @for (vacancy of group().vacancies; track vacancy.id) {
          <app-vacancy-card [vacancy]="vacancy" />
        }
      </div>
    </section>
  `,
  styles: [`
    .group {
      margin-bottom: 2rem;
    }
    .group-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #E2E8F0;
    }
    .group-label {
      font-size: 1.125rem;
      font-weight: 700;
      color: #0F2342;
      margin: 0;
    }
    .group-count {
      background: #0F2342;
      color: #fff;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.15rem 0.6rem;
      border-radius: 9999px;
    }
    .group-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    @media (max-width: 480px) {
      .group-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class VacancyGroupComponent {
  readonly group = input.required<VacancyGroup>();
}
