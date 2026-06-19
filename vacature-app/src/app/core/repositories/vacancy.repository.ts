import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Vacancy } from '../models/vacancy.model';

export interface VacancyRepository {
  getAll(): Observable<Vacancy[]>;
  getById(id: string): Observable<Vacancy | undefined>;
}

export const VACANCY_REPOSITORY = new InjectionToken<VacancyRepository>('VacancyRepository');
