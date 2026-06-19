import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { VACANCY_REPOSITORY } from '../repositories/vacancy.repository';
import { Vacancy } from '../models/vacancy.model';

@Injectable({ providedIn: 'root' })
export class VacancyService {
  private readonly repo = inject(VACANCY_REPOSITORY);

  readonly vacancies = toSignal(this.repo.getAll(), { initialValue: [] as Vacancy[] });

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
