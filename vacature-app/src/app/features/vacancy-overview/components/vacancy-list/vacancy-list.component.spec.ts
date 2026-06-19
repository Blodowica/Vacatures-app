import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../../core/repositories/vacancy-mock.repository';
import { VacancyListComponent } from './vacancy-list.component';

describe('VacancyListComponent', () => {
  let fixture: ComponentFixture<VacancyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyListComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyListComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display vacancy cards when results exist', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.list')).toBeTruthy();
  });
});
