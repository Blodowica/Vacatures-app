import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VacancyCardComponent } from './vacancy-card.component';
import { Vacancy } from '../../../../core/models/vacancy.model';

const mockVacancy: Vacancy = {
  id: 'test-1',
  title: 'Test Vacature',
  department: 'IT Afdeling',
  personnelType: 'military',
  rank: 'Sergeant',
  scale: null,
  functionDomain: 'Software Development',
  locations: ['Den Haag'],
  roleDescription: 'Test rol beschrijving',
  dailyActivities: 'Test dagelijkse activiteiten',
  weeklyCalendar: [],
  workDistribution: [],
  skills: [],
};

describe('VacancyCardComponent', () => {
  let fixture: ComponentFixture<VacancyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyCardComponent],
      providers: [provideRouter([]), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyCardComponent);
    fixture.componentRef.setInput('vacancy', mockVacancy);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the vacancy title', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Test Vacature');
  });

  it('should show military chip for military vacancies', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Militair');
  });
});
