import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY } from 'rxjs';
import { VACANCY_REPOSITORY } from '../repositories/vacancy.repository';
import { VacancyMockRepository } from '../repositories/mock/vacancy-mock.repository';
import { Vacancy } from '../models/vacancy.model';

const MOCK_SESSION_KEY = 'vacature_use_mock';

@Injectable({ providedIn: 'root' })
export class VacancyService {
  private readonly repo = inject(VACANCY_REPOSITORY);
  private readonly mockRepo = inject(VacancyMockRepository);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly vacancies = signal<Vacancy[]>([]);
  readonly loadError = signal<string | null>(null);

  constructor() {
    if (!this.isBrowser) return;

    if (sessionStorage.getItem(MOCK_SESSION_KEY) === 'true') {
      this.mockRepo.getAll().subscribe(data => this.vacancies.set(data));
    } else {
      this.fetchFromApi();
    }
  }

  private fetchFromApi(): void {
    this.repo.getAll().pipe(
      catchError(err => {
        const message = err.status === 0
          ? 'Kan geen verbinding maken met de API-server. Controleer of de backend actief is.'
          : `De server heeft een fout geretourneerd (${err.status} ${err.statusText}).`;
        this.loadError.set(message);
        return EMPTY;
      })
    ).subscribe(data => this.vacancies.set(data));
  }

  loadMockData(): void {
    if (this.isBrowser) {
      sessionStorage.setItem(MOCK_SESSION_KEY, 'true');
    }
    this.loadError.set(null);
    this.mockRepo.getAll().subscribe(data => this.vacancies.set(data));
  }

  getById(id: string): Vacancy | undefined {
    return this.vacancies().find(v => v.id === id);
  }

  getAllRanks(): string[] {
    return [...new Set(
      this.vacancies()
        .filter(v => v.personnelType === 'military' && v.rank)
        .map(v => v.rank!)
    )];
  }

  getAllScales(): string[] {
    return [...new Set(
      this.vacancies()
        .filter(v => v.personnelType === 'civilian' && v.scale)
        .map(v => v.scale!)
    )].sort();
  }

  getAllDomains(): string[] {
    return [...new Set(this.vacancies().map(v => v.functionDomain))].sort();
  }

  getAllLocations(): string[] {
    return [...new Set(this.vacancies().flatMap(v => v.locations))].sort();
  }
}
