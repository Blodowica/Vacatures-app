import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../core/repositories/vacancy-mock.repository';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('VacancyExplorer');
  });
});
