import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VacancyOverviewPage } from '../../app/features/vacancy-overview/pages/vacancy-overview.page';
import { FilterService } from '../../app/core/services/filter.service';
import { VACANCY_REPOSITORY } from '../../app/core/repositories/vacancy.repository';
import { TestVacancyRepository } from '../fixtures/test-vacancies';

/**
 * Integration test for the overview journey: a real component tree
 * (VacancyOverviewPage -> FilterPanel + VacancyList -> VacancyGroup -> VacancyCard)
 * wired to the real FilterService and VacancyService, backed by an in-memory
 * repository. Exercises the user-visible result of filtering and searching.
 */
describe('Vacancy overview (integration)', () => {
  let fixture: ComponentFixture<VacancyOverviewPage>;
  let filter: FilterService;

  const render = () => {
    fixture.detectChanges();
  };

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyOverviewPage],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: TestVacancyRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyOverviewPage);
    filter = TestBed.inject(FilterService);
    filter.resetFilters();
    render();
  });

  // ---- Happy flow ---------------------------------------------------------

  it('renders all vacancies grouped into Militair and Burgerpersoneel sections', () => {
    expect(filter.totalCount()).toBe(4);
    expect(text()).toContain('Militair');
    expect(text()).toContain('Burgerpersoneel');
    expect(text()).toContain('Software Engineer Defensie');
    expect(text()).toContain('Data Scientist');
  });

  it('narrows results to a single section when filtering by personnel type', () => {
    filter.setPersonnelType('military');
    render();

    expect(filter.totalCount()).toBe(2);
    expect(text()).toContain('Software Engineer Defensie');
    expect(text()).toContain('Security Analist');
    expect(text()).not.toContain('Data Scientist');
  });

  it('filters by a search query across title and domain', () => {
    filter.searchQuery.set('security');
    render();

    expect(filter.totalCount()).toBe(1);
    expect(text()).toContain('Security Analist');
    expect(text()).not.toContain('Backend Developer');
  });

  it('filters across both personnel types by function domain', () => {
    filter.toggleDomain('Software Development');
    render();

    // 1 military + 1 civilian share this domain
    expect(filter.totalCount()).toBe(2);
    expect(text()).toContain('Software Engineer Defensie');
    expect(text()).toContain('Backend Developer');
  });

  it('restores the full list after resetting filters', () => {
    filter.searchQuery.set('security');
    render();
    expect(filter.totalCount()).toBe(1);

    filter.resetFilters();
    render();
    expect(filter.totalCount()).toBe(4);
  });

  // ---- Bad flow -----------------------------------------------------------

  it('shows the empty state when a search matches nothing', () => {
    filter.searchQuery.set('zzz-nonexistent-query');
    render();

    expect(filter.totalCount()).toBe(0);
    expect(text()).toContain('Geen vacatures gevonden');
    expect(text()).not.toContain('Software Engineer Defensie');
  });

  it('shows the empty state when a domain + location combo has no overlap', () => {
    // Cyber Security only exists in Amsterdam, never in Utrecht.
    filter.toggleDomain('Cyber Security');
    filter.toggleLocation('Utrecht');
    render();

    expect(filter.totalCount()).toBe(0);
    expect(text()).toContain('Geen vacatures gevonden');
  });
});
