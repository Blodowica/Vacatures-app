import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../../core/repositories/vacancy-mock.repository';
import { FunctionDomainFilterComponent } from './function-domain-filter.component';

describe('FunctionDomainFilterComponent', () => {
  let fixture: ComponentFixture<FunctionDomainFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunctionDomainFilterComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FunctionDomainFilterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should support multi-select', () => {
    expect(fixture.componentInstance.domains().length).toBeGreaterThan(0);
  });
});
