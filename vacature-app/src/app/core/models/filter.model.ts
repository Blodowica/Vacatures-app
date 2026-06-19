import { PersonnelType, Vacancy } from './vacancy.model';

export interface VacancyFilter {
  personnelType: PersonnelType | 'all';
  rank: string | null;
  scale: string | null;
  functionDomain: string[];
  locations: string[];
  searchQuery: string;
}

export interface VacancyGroup {
  label: string;
  vacancies: Vacancy[];
}

export interface GroupedSection {
  sectionTitle: string | null;
  personnelType: PersonnelType | 'all';
  groups: VacancyGroup[];
}
