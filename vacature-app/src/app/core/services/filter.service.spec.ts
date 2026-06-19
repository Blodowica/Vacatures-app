import { TestBed } from '@angular/core/testing';
import { VACANCY_REPOSITORY } from '../repositories/vacancy.repository';
import { VacancyMockRepository } from '../repositories/vacancy-mock.repository';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterService,
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with default filter state', () => {
    expect(service.personnelType()).toBe('all');
    expect(service.rank()).toBeNull();
    expect(service.scale()).toBeNull();
    expect(service.functionDomain()).toEqual([]);
    expect(service.locations()).toEqual([]);
    expect(service.searchQuery()).toBe('');
  });

  it('should return zero active filter count by default', () => {
    expect(service.activeFilterCount()).toBe(0);
  });

  it('should increment active filter count when a filter is applied', () => {
    service.personnelType.set('military');
    expect(service.activeFilterCount()).toBe(1);
  });

  it('should reset all filters', () => {
    service.personnelType.set('military');
    service.searchQuery.set('test');
    service.resetFilters();
    expect(service.personnelType()).toBe('all');
    expect(service.searchQuery()).toBe('');
    expect(service.activeFilterCount()).toBe(0);
  });

  it('should return sections for all vacancies by default', () => {
    expect(service.sections().length).toBeGreaterThan(0);
    expect(service.totalCount()).toBeGreaterThan(0);
  });

  it('should filter by personnel type', () => {
    service.setPersonnelType('military');
    const allMilitary = service.sections()
      .flatMap(s => s.groups)
      .flatMap(g => g.vacancies)
      .every(v => v.personnelType === 'military');
    expect(allMilitary).toBe(true);
  });

  it('should toggle a location on and off', () => {
    service.toggleLocation('Den Haag');
    expect(service.locations()).toContain('Den Haag');
    service.toggleLocation('Den Haag');
    expect(service.locations()).not.toContain('Den Haag');
  });
});
