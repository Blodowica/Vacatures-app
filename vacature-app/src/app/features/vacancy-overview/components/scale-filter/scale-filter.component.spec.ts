import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../../core/repositories/vacancy-mock.repository';
import { ScaleFilterComponent } from './scale-filter.component';

describe('ScaleFilterComponent', () => {
  let fixture: ComponentFixture<ScaleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaleFilterComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScaleFilterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should derive scales from vacancy data', () => {
    expect(fixture.componentInstance.scales().length).toBeGreaterThan(0);
  });
});
