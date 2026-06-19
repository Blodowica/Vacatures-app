import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../../core/repositories/vacancy-mock.repository';
import { FilterPanelComponent } from './filter-panel.component';

describe('FilterPanelComponent', () => {
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPanelComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPanelComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit close event', () => {
    let emitted = false;
    fixture.componentInstance.close.subscribe(() => (emitted = true));
    fixture.componentInstance.close.emit();
    expect(emitted).toBe(true);
  });
});
