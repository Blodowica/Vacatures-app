import { TestBed } from '@angular/core/testing';
import { VACANCY_REPOSITORY } from '../repositories/vacancy.repository';
import { VacancyMockRepository } from '../repositories/vacancy-mock.repository';
import { VacancyService } from './vacancy.service';

describe('VacancyService', () => {
  let service: VacancyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VacancyService,
        { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
      ],
    });
    service = TestBed.inject(VacancyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load vacancies from the repository', () => {
    expect(service.vacancies().length).toBeGreaterThan(0);
  });

  it('should return all unique ranks', () => {
    const ranks = service.getAllRanks();
    expect(ranks.length).toBeGreaterThan(0);
    expect(new Set(ranks).size).toBe(ranks.length);
  });

  it('should return all unique scales', () => {
    const scales = service.getAllScales();
    expect(scales.length).toBeGreaterThan(0);
  });

  it('should return all unique domains', () => {
    const domains = service.getAllDomains();
    expect(domains.length).toBeGreaterThan(0);
  });

  it('should return all unique locations', () => {
    const locations = service.getAllLocations();
    expect(locations.length).toBeGreaterThan(0);
  });

  it('should find a vacancy by id', () => {
    const first = service.vacancies()[0];
    expect(service.getById(first.id)).toEqual(first);
  });

  it('should return undefined for an unknown id', () => {
    expect(service.getById('does-not-exist')).toBeUndefined();
  });
});
