import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { VACANCY_REPOSITORY } from '../../../../core/repositories/vacancy.repository';
import { VacancyMockRepository } from '../../../../core/repositories/vacancy-mock.repository';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should clear the search control', () => {
    fixture.componentInstance.searchControl.setValue('test');
    fixture.componentInstance.clear();
    expect(fixture.componentInstance.searchControl.value).toBe('');
  });
});
