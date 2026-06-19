import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vacancy } from '../../models/vacancy.model';
import { VacancyRepository } from '../vacancy.repository';
import vacanciesData from '../../../../assets/data/vacancies.json';

@Injectable({ providedIn: 'root' })
export class VacancyMockRepository implements VacancyRepository {
  private readonly EXCLUDED_IDS = new Set(['6', '11', '25', '29', '32']);
  private readonly data: Vacancy[] = (vacanciesData as unknown as Vacancy[])
    .filter(v => !this.EXCLUDED_IDS.has(v.id))
    .map(v => ({ ...v, title: `${v.title} <<mock>>` }));

  getAll(): Observable<Vacancy[]> {
    return of(this.data);
  }

  getById(id: string): Observable<Vacancy | undefined> {
    return of(this.data.find(v => v.id === id));
  }
}
