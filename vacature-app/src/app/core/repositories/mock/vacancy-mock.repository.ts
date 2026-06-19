import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vacancy } from '../../models/vacancy.model';
import { VacancyRepository } from '../vacancy.repository';
import vacanciesData from '../../../../assets/data/vacancies.json';

@Injectable({ providedIn: 'root' })
export class VacancyMockRepository implements VacancyRepository {
  private readonly data: Vacancy[] = vacanciesData as unknown as Vacancy[];

  getAll(): Observable<Vacancy[]> {
    return of(this.data);
  }

  getById(id: string): Observable<Vacancy | undefined> {
    return of(this.data.find(v => v.id === id));
  }
}
