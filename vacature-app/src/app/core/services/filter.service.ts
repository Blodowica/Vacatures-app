import { computed, inject, Injectable, signal } from '@angular/core';
import { PersonnelType, Vacancy } from '../models/vacancy.model';
import { GroupedSection, VacancyFilter, VacancyGroup } from '../models/filter.model';
import { VacancyService } from './vacancy.service';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private readonly vacancyService = inject(VacancyService);

  readonly personnelType = signal<PersonnelType | 'all'>('all');
  readonly rank = signal<string | null>(null);
  readonly scale = signal<string | null>(null);
  readonly functionDomain = signal<string | null>(null);
  readonly locations = signal<string[]>([]);
  readonly searchQuery = signal<string>('');

  readonly activeFilter = computed<VacancyFilter>(() => ({
    personnelType: this.personnelType(),
    rank: this.rank(),
    scale: this.scale(),
    functionDomain: this.functionDomain(),
    locations: this.locations(),
    searchQuery: this.searchQuery(),
  }));

  readonly sections = computed<GroupedSection[]>(() => {
    const filter = this.activeFilter();
    const all = this.vacancyService.vacancies();
    const filtered = this.applyFilters(all, filter);
    return this.buildSections(filtered, filter);
  });

  readonly totalCount = computed(() =>
    this.sections().reduce((acc, s) => acc + s.groups.reduce((a, g) => a + g.vacancies.length, 0), 0)
  );

  setPersonnelType(type: PersonnelType | 'all'): void {
    this.personnelType.set(type);
    this.rank.set(null);
    this.scale.set(null);
  }

  toggleLocation(location: string): void {
    const current = this.locations();
    const idx = current.indexOf(location);
    this.locations.set(idx >= 0
      ? current.filter(l => l !== location)
      : [...current, location]
    );
  }

  resetFilters(): void {
    this.personnelType.set('all');
    this.rank.set(null);
    this.scale.set(null);
    this.functionDomain.set(null);
    this.locations.set([]);
    this.searchQuery.set('');
  }

  private applyFilters(vacancies: Vacancy[], filter: VacancyFilter): Vacancy[] {
    return vacancies.filter(v => {
      if (filter.personnelType !== 'all' && v.personnelType !== filter.personnelType) return false;
      if (filter.rank && v.rank !== filter.rank) return false;
      if (filter.scale && v.scale !== filter.scale) return false;
      if (filter.functionDomain && v.functionDomain !== filter.functionDomain) return false;
      if (filter.locations.length > 0 && !filter.locations.some(l => v.locations.includes(l))) return false;
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        if (!v.title.toLowerCase().includes(q) &&
            !v.department.toLowerCase().includes(q) &&
            !v.functionDomain.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  private buildSections(vacancies: Vacancy[], filter: VacancyFilter): GroupedSection[] {
    if (filter.personnelType === 'all') {
      const military = vacancies.filter(v => v.personnelType === 'military');
      const civilian = vacancies.filter(v => v.personnelType === 'civilian');
      const sections: GroupedSection[] = [];
      if (military.length > 0) {
        sections.push({ sectionTitle: 'Militair', personnelType: 'military', groups: this.groupVacancies(military, 'military', filter) });
      }
      if (civilian.length > 0) {
        sections.push({ sectionTitle: 'Burgerpersoneel', personnelType: 'civilian', groups: this.groupVacancies(civilian, 'civilian', filter) });
      }
      return sections;
    }

    const groups = this.groupVacancies(vacancies, filter.personnelType as PersonnelType, filter);
    return [{ sectionTitle: null, personnelType: filter.personnelType, groups }];
  }

  private groupVacancies(vacancies: Vacancy[], type: PersonnelType, filter: VacancyFilter): VacancyGroup[] {
    const getKey = (v: Vacancy): string => {
      if (filter.rank || filter.scale) return v.functionDomain;
      if (filter.functionDomain) return type === 'military' ? (v.rank ?? 'Onbekend') : (v.scale ?? 'Onbekend');
      return type === 'military' ? (v.rank ?? 'Onbekend') : (v.scale ?? 'Onbekend');
    };

    const map = new Map<string, Vacancy[]>();
    for (const v of vacancies) {
      const key = getKey(v);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(v);
    }

    return Array.from(map.entries()).map(([label, vacs]) => ({ label, vacancies: vacs }));
  }
}
