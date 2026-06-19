import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacancy } from '../models/vacancy.model';
import { VacancyRepository } from './vacancy.repository';

// To switch from mock to real API, change app.config.ts:
//   { provide: VACANCY_REPOSITORY, useClass: VacancyApiRepository }
@Injectable({ providedIn: 'root' })
export class VacancyApiRepository implements VacancyRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/vacancies';

  getAll(): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(this.baseUrl);
  }

  getById(id: string): Observable<Vacancy | undefined> {
    return this.http.get<Vacancy | undefined>(`${this.baseUrl}/${id}`);
  }
}
