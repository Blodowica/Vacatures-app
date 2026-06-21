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
  readonly functionDomain = signal<string[]>([]);
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
    const filtered = this.applyFilters(this.vacancyService.vacancies(), filter);
    return this.buildSections(filtered, filter);
  });

  readonly totalCount = computed(() =>
    this.sections().reduce((acc, s) => acc + s.groups.reduce((a, g) => a + g.vacancies.length, 0), 0)
  );

  readonly activeFilterCount = computed(() => {
    const f = this.activeFilter();
    let count = 0;
    if (f.personnelType !== 'all') count++;
    if (f.rank) count++;
    if (f.scale) count++;
    count += f.functionDomain.length;
    count += f.locations.length;
    return count;
  });

  setPersonnelType(type: PersonnelType | 'all'): void {
    this.personnelType.set(type);
    this.rank.set(null);
    this.scale.set(null);
  }

  toggleDomain(domain: string): void {
    const current = this.functionDomain();
    this.functionDomain.set(
      current.includes(domain) ? current.filter(d => d !== domain) : [...current, domain]
    );
  }

  toggleLocation(location: string): void {
    const current = this.locations();
    this.locations.set(
      current.includes(location) ? current.filter(l => l !== location) : [...current, location]
    );
  }

  resetFilters(): void {
    this.personnelType.set('all');
    this.rank.set(null);
    this.scale.set(null);
    this.functionDomain.set([]);
    this.locations.set([]);
    this.searchQuery.set('');
  }

  private applyFilters(vacancies: Vacancy[], filter: VacancyFilter): Vacancy[] {
    const rankActive = !!filter.rank;
    const scaleActive = !!filter.scale;

    return vacancies.filter(v => {
      if (filter.personnelType !== 'all' && v.personnelType !== filter.personnelType) return false;

      // Rank scopes the result to military, scale scopes it to civilian. With
      // only one active, the other personnel type is hidden entirely; with both
      // active, each type is shown filtered by its own criterion.
      if (rankActive || scaleActive) {
        if (v.personnelType === 'military') {
          if (!rankActive || v.rank !== filter.rank) return false;
        } else {
          if (!scaleActive || v.scale !== filter.scale) return false;
        }
      }

      if (filter.functionDomain.length > 0 && !filter.functionDomain.includes(v.functionDomain)) return false;
      if (filter.locations.length > 0 && !filter.locations.some(l => v.locations.includes(l))) return false;
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        if (!v.title.toLowerCase().includes(q) &&
            !v.department.toLowerCase().includes(q) &&
            !v.functionDomain.toLowerCase().includes(q) &&
            !v.locations.some(l => l.toLowerCase().includes(q))) return false;
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
    return [{ sectionTitle: null, personnelType: filter.personnelType, groups: this.groupVacancies(vacancies, filter.personnelType as PersonnelType, filter) }];
  }

  private groupVacancies(vacancies: Vacancy[], type: PersonnelType, filter: VacancyFilter): VacancyGroup[] {
    const getKey = (v: Vacancy): string => {
      if (filter.rank || filter.scale) return v.functionDomain;
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
