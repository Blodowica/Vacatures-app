import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../../core/repositories/vacancy-mock.repository';
import { PersonnelTypeFilterComponent } from './personnel-type-filter.component';

describe('PersonnelTypeFilterComponent', () => {
  let fixture: ComponentFixture<PersonnelTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnelTypeFilterComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonnelTypeFilterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose all three options', () => {
    expect(fixture.componentInstance.options.map(o => o.value)).toEqual(['all', 'military', 'civilian']);
  });
});
