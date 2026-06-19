import { Component, inject, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VacancyService } from '../../../core/services/vacancy.service';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { WeeklyCalendarComponent } from '../components/weekly-calendar/weekly-calendar.component';
import { WorkDistributionComponent } from '../components/work-distribution/work-distribution.component';
import { SkillsSectionComponent } from '../components/skills-section/skills-section.component';

@Component({
  selector: 'app-vacancy-detail',
  standalone: true,
  imports: [RouterLink, BadgeComponent, WeeklyCalendarComponent, WorkDistributionComponent, SkillsSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vacancy()) {
      <div class="page">
        <!-- Back -->
        <div class="back-bar">
          <div class="inner">
            <a routerLink="/" class="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Terug naar vacatures
            </a>
          </div>
        </div>

        <!-- Hero Header -->
        <div class="hero">
          <div class="inner">
            <div class="hero-meta">
              <app-badge [variant]="vacancy()!.personnelType === 'military' ? 'military' : 'civilian'">
                {{ vacancy()!.personnelType === 'military' ? 'Militair' : 'Burgerpersoneel' }}
              </app-badge>
              <app-badge variant="domain">{{ vacancy()!.functionDomain }}</app-badge>
              @for (loc of vacancy()!.locations; track loc) {
                <app-badge variant="location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:3px">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ loc }}
                </app-badge>
              }
            </div>
            <h1 class="hero-title">{{ vacancy()!.title }}</h1>
            <p class="hero-dept">{{ vacancy()!.department }}</p>
            <div class="hero-tags">
              @if (vacancy()!.rank) {
                <div class="hero-tag">
                  <span class="tag-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </span>
                  <span class="tag-label">Rang</span>
                  <span class="tag-value">{{ vacancy()!.rank }}</span>
                </div>
              }
              @if (vacancy()!.scale) {
                <div class="hero-tag">
                  <span class="tag-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </span>
                  <span class="tag-label">Schaal</span>
                  <span class="tag-value">{{ vacancy()!.scale }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Content Sections -->
        <div class="content-area">
          <div class="inner">
            <div class="sections">

              <!-- What do I do -->
              <section class="section">
                <div class="section-heading">
                  <div class="section-num">01</div>
                  <h2 class="section-title">Wat doe ik?</h2>
                </div>
                <div class="section-body">
                  <div class="prose-block">
                    <h3 class="prose-title">Over de rol</h3>
                    <p class="prose-text">{{ vacancy()!.roleDescription }}</p>
                  </div>
                  <div class="prose-block">
                    <h3 class="prose-title">Dagelijkse activiteiten</h3>
                    <p class="prose-text">{{ vacancy()!.dailyActivities }}</p>
                  </div>
                </div>
              </section>

              <!-- Weekly Calendar -->
              <section class="section">
                <div class="section-heading">
                  <div class="section-num">02</div>
                  <h2 class="section-title">Hoe ziet mijn week eruit?</h2>
                </div>
                <div class="section-body">
                  <app-weekly-calendar [activities]="vacancy()!.weeklyCalendar" />
                  <div class="calendar-legend">
                    <span class="cal-legend-item"><span class="cal-dot" style="background:#3B82F6"></span>Overleg</span>
                    <span class="cal-legend-item"><span class="cal-dot" style="background:#10B981"></span>Ontwikkeling</span>
                    <span class="cal-legend-item"><span class="cal-dot" style="background:#F59E0B"></span>Testing</span>
                    <span class="cal-legend-item"><span class="cal-dot" style="background:#EF4444"></span>Security</span>
                    <span class="cal-legend-item"><span class="cal-dot" style="background:#64748B"></span>Documentatie</span>
                  </div>
                </div>
              </section>

              <!-- Work Distribution -->
              <section class="section">
                <div class="section-heading">
                  <div class="section-num">03</div>
                  <h2 class="section-title">Hoe wordt mijn tijd verdeeld?</h2>
                </div>
                <div class="section-body">
                  <app-work-distribution [distributions]="vacancy()!.workDistribution" />
                </div>
              </section>

              <!-- Skills -->
              <section class="section">
                <div class="section-heading">
                  <div class="section-num">04</div>
                  <h2 class="section-title">Welke competenties zijn vereist?</h2>
                </div>
                <div class="section-body">
                  <app-skills-section [skills]="vacancy()!.skills" />
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <h2>Vacature niet gevonden</h2>
        <a routerLink="/" class="back-link">Terug naar overzicht</a>
      </div>
    }
  `,
  styles: [`
    .page { min-height: calc(100vh - 64px); }
    .inner { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
    .back-bar {
      background: #fff;
      border-bottom: 1px solid #E2E8F0;
      padding: 0.75rem 0;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #475569;
      text-decoration: none;
      transition: color 0.15s;
    }
    .back-link:hover { color: #0F2342; }
    .hero {
      background: linear-gradient(135deg, #0F2342 0%, #1E3A5F 60%, #0F4C75 100%);
      padding: 2.5rem 0 3rem;
    }
    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-bottom: 1rem;
    }
    .hero-title {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 800;
      color: #fff;
      margin: 0 0 0.375rem;
      letter-spacing: -0.03em;
      line-height: 1.2;
    }
    .hero-dept {
      font-size: 1rem;
      color: rgba(255,255,255,0.65);
      margin: 0 0 1.25rem;
    }
    .hero-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .hero-tag {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      padding: 0.4rem 0.75rem;
    }
    .tag-label {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tag-value {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #fff;
      margin-left: 0.25rem;
    }
    .content-area {
      padding: 2rem 0 3rem;
    }
    .sections { display: flex; flex-direction: column; gap: 2.5rem; }
    .section {
      background: #fff;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .section-heading {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #F1F5F9;
      background: #FAFBFC;
    }
    .section-num {
      font-size: 0.75rem;
      font-weight: 800;
      color: #F59E0B;
      background: #FEF3C7;
      border-radius: 6px;
      padding: 0.2rem 0.5rem;
      letter-spacing: 0.05em;
    }
    .section-title {
      font-size: 1.125rem;
      font-weight: 800;
      color: #0F2342;
      margin: 0;
    }
    .section-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .prose-block {}
    .prose-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #0F2342;
      margin: 0 0 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .prose-text {
      font-size: 0.9375rem;
      color: #374151;
      line-height: 1.7;
      margin: 0;
    }
    .calendar-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem 1.25rem;
      padding-top: 0.75rem;
      border-top: 1px solid #F1F5F9;
    }
    .cal-legend-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: #64748B;
    }
    .cal-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      gap: 1rem;
      color: #64748B;
    }
    @media (max-width: 640px) {
      .section-body { padding: 1rem; }
      .hero { padding: 1.5rem 0 2rem; }
    }
  `]
})
export class VacancyDetailPage {
  readonly id = input.required<string>();
  private readonly vacancyService = inject(VacancyService);

  readonly vacancy = computed(() => this.vacancyService.getById(this.id()));
}
