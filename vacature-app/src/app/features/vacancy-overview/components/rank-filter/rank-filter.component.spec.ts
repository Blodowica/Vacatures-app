import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../../core/repositories/vacancy-mock.repository';
import { RankFilterComponent } from './rank-filter.component';

describe('RankFilterComponent', () => {
  let fixture: ComponentFixture<RankFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankFilterComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RankFilterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should derive ranks from vacancy data', () => {
    expect(fixture.componentInstance.ranks().length).toBeGreaterThan(0);
  });
});
