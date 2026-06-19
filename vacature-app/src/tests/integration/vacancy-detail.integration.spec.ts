import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VacancyDetailPage } from '../../app/features/vacancy-detail/pages/vacancy-detail.page';
import { VACANCY_REPOSITORY } from '../../app/core/repositories/vacancy.repository';
import { TestVacancyRepository } from '../fixtures/test-vacancies';

/**
 * Integration test for the detail journey: VacancyDetailPage resolves a vacancy
 * by its route `id` input through the real VacancyService + repository and
 * renders the full detail tree (hero, badges, contact, apply button).
 */
describe('Vacancy detail (integration)', () => {
  let fixture: ComponentFixture<VacancyDetailPage>;

  const setup = async (id: string) => {
    await TestBed.configureTestingModule({
      imports: [VacancyDetailPage],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: TestVacancyRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyDetailPage);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  // ---- Happy flow ---------------------------------------------------------

  it('renders the vacancy details for a known id', async () => {
    await setup('mil-1');

    expect(text()).toContain('Software Engineer Defensie');
    expect(text()).toContain('Joint IT Commando');
    expect(text()).toContain('Militair');
    expect(text()).toContain('Den Haag');
    expect(text()).not.toContain('Vacature niet gevonden');
  });

  it('builds a mailto apply link with the encoded subject', async () => {
    await setup('mil-1');

    const link = (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLAnchorElement>('a.solliciteer-btn');
    expect(link).toBeTruthy();
    expect(link!.getAttribute('href')).toBe(
      'mailto:jan.devries@mindef.nl?subject=Sollicitatie%20Software%20Engineer%20Defensie'
    );
  });

  it('renders the schaal tag for a civilian vacancy', async () => {
    await setup('civ-1');

    expect(text()).toContain('Backend Developer');
    expect(text()).toContain('Burgerpersoneel');
    expect(text()).toContain('Schaal 10');
  });

  // ---- Bad flow -----------------------------------------------------------

  it('shows a "not found" message for an unknown id', async () => {
    await setup('does-not-exist');

    expect(text()).toContain('Vacature niet gevonden');
    expect(text()).not.toContain('Software Engineer Defensie');
  });

  it('produces an empty apply link when the vacancy is missing', async () => {
    await setup('does-not-exist');

    expect(fixture.componentInstance.mailtoLink()).toBe('');
  });
});
