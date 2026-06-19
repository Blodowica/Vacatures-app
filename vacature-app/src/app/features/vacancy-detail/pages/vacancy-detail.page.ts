import { Component, inject, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { VacancyService } from '../../../core/services/vacancy.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { WeeklyCalendarComponent } from '../components/weekly-calendar/weekly-calendar.component';
import { WorkDistributionComponent } from '../components/work-distribution/work-distribution.component';
import { SkillsSectionComponent } from '../components/skills-section/skills-section.component';
import { ContactSectionComponent } from '../components/contact-section/contact-section.component';

@Component({
  selector: 'app-vacancy-detail',
  standalone: true,
  imports: [RouterLink, MatIcon, BadgeComponent, WeeklyCalendarComponent, WorkDistributionComponent, SkillsSectionComponent, ContactSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vacancy-detail.page.html',
  styleUrl: './vacancy-detail.page.scss',
})
export class VacancyDetailPage {
  readonly id = input.required<string>();
  private readonly vacancyService = inject(VacancyService);

  readonly vacancy = computed(() => this.vacancyService.getById(this.id()));

  readonly mailtoLink = computed(() => {
    const v = this.vacancy();
    if (!v) return '';
    const subject = encodeURIComponent(`Sollicitatie ${v.title}`);
    return `mailto:${v.contactPerson.email}?subject=${subject}`;
  });
}
