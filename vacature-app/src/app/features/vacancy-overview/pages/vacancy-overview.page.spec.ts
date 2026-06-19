import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../core/repositories/vacancy-mock.repository';
import { VacancyOverviewPage } from './vacancy-overview.page';

describe('VacancyOverviewPage', () => {
  let fixture: ComponentFixture<VacancyOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyOverviewPage],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyOverviewPage);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with mobile filters hidden', () => {
    expect(fixture.componentInstance.showMobileFilters()).toBe(false);
  });

  it('should toggle mobile filters', () => {
    fixture.componentInstance.toggleMobileFilters();
    expect(fixture.componentInstance.showMobileFilters()).toBe(true);

    fixture.componentInstance.closeMobileFilters();
    expect(fixture.componentInstance.showMobileFilters()).toBe(false);
  });
});
