import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../../core/repositories/vacancy-mock.repository';
import { LocationFilterComponent } from './location-filter.component';

describe('LocationFilterComponent', () => {
  let fixture: ComponentFixture<LocationFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationFilterComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationFilterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should derive locations from vacancy data', () => {
    expect(fixture.componentInstance.locations().length).toBeGreaterThan(0);
  });
});
