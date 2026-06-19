import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vacancy } from '../models/vacancy.model';
import { VacancyRepository } from './vacancy.repository';
import { environment } from '../../../environments/environment';

interface PaginatedVacancies {
  items: Vacancy[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class VacancyApiRepository implements VacancyRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/vacancies`;

  getAll(): Observable<Vacancy[]> {
    return this.http
      .get<PaginatedVacancies>(`${this.baseUrl}/`, { params: { pageSize: 500 } })
      .pipe(map(response => response.items));
  }

  getById(id: string): Observable<Vacancy | undefined> {
    return this.http.get<Vacancy>(`${this.baseUrl}/${id}`);
  }
}
