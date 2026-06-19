import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VacancyGroupComponent } from './vacancy-group.component';
import { VacancyGroup } from '../../../../core/models/filter.model';

const mockGroup: VacancyGroup = {
  label: 'Software Development',
  vacancies: [],
};

describe('VacancyGroupComponent', () => {
  let fixture: ComponentFixture<VacancyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacancyGroupComponent],
      providers: [provideRouter([]), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(VacancyGroupComponent);
    fixture.componentRef.setInput('group', mockGroup);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the group label', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Software Development');
  });
});
