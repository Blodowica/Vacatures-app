import { TestBed } from '@angular/core/testing';
import { VACANCY_REPOSITORY } from '../repositories/vacancy.repository';
import { VacancyMockRepository } from '../repositories/vacancy-mock.repository';
import { FilterService } from './filter.service';
import { VacancyService } from './vacancy.service';
import { Vacancy } from '../models/vacancy.model';

describe('FilterService', () => {
  let service: FilterService;
  let vacancyService: VacancyService;

  const visibleVacancies = (): Vacancy[] =>
    service.sections().flatMap(s => s.groups).flatMap(g => g.vacancies);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterService,
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    });
    service = TestBed.inject(FilterService);
    vacancyService = TestBed.inject(VacancyService);
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

  // ---- Rank / scale scoping --------------------------------------------------

  it('shows only military vacancies when only a rank is selected', () => {
    const rank = vacancyService.getAllRanks()[0];
    service.rank.set(rank);

    const results = visibleVacancies();
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(v => v.personnelType === 'military' && v.rank === rank)).toBe(true);
  });

  it('shows only civilian vacancies when only a scale is selected', () => {
    const scale = vacancyService.getAllScales()[0];
    service.scale.set(scale);

    const results = visibleVacancies();
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(v => v.personnelType === 'civilian' && v.scale === scale)).toBe(true);
  });

  it('shows both types — each by its own criterion — when a rank and a scale are both selected', () => {
    const rank = vacancyService.getAllRanks()[0];
    const scale = vacancyService.getAllScales()[0];
    service.rank.set(rank);
    service.scale.set(scale);

    const results = visibleVacancies();
    const military = results.filter(v => v.personnelType === 'military');
    const civilian = results.filter(v => v.personnelType === 'civilian');

    expect(military.length).toBeGreaterThan(0);
    expect(civilian.length).toBeGreaterThan(0);
    expect(military.every(v => v.rank === rank)).toBe(true);
    expect(civilian.every(v => v.scale === scale)).toBe(true);
  });
});
