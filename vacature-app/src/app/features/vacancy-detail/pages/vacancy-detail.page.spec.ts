import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../core/repositories/vacancy-mock.repository';
import { VacancyDetailPage } from './vacancy-detail.page';

describe('VacancyDetailPage', () => {
  let fixture: ComponentFixture<VacancyDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyDetailPage],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyDetailPage);
    fixture.componentRef.setInput('id', 'nonexistent-id');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show not-found state for unknown id', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.not-found')).toBeTruthy();
  });
});
