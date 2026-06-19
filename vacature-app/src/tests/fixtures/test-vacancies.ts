import { Observable, of } from 'rxjs';
import { Vacancy } from '../../app/core/models/vacancy.model';
import { VacancyRepository } from '../../app/core/repositories/vacancy.repository';

/**
 * Deterministic dataset used by integration tests.
 *
 * Keeping a small, hand-written fixture (instead of the large mock JSON) means
 * the assertions below stay stable even when the real mock data grows or changes.
 *
 * Shape of the set:
 *   - 2 military   (ranks Sergeant / Korporaal)
 *   - 2 civilian   (scales Schaal 10 / Schaal 11)
 *   - "Software Development" appears in 1 military + 1 civilian
 *   - "Den Haag" appears in 1 military + 1 civilian
 */
export const TEST_VACANCIES: Vacancy[] = [
  {
    id: 'mil-1',
    title: 'Software Engineer Defensie',
    department: 'Joint IT Commando',
    personnelType: 'military',
    rank: 'Sergeant',
    functionDomain: 'Software Development',
    locations: ['Den Haag'],
    roleDescription: 'Je bouwt veilige software voor operationele systemen.',
    dailyActivities: 'Coderen, code reviews en overleg met het team.',
    weeklyCalendar: [],
    workDistribution: [{ category: 'Ontwikkeling', percentage: 100 }],
    skills: [{ skillName: 'Angular', level: 4, description: 'Frontend framework' }],
    contactPerson: { name: 'Jan de Vries', email: 'jan.devries@mindef.nl', phone: '0612345678' },
  },
  {
    id: 'mil-2',
    title: 'Security Analist',
    department: 'Defensie Cyber Commando',
    personnelType: 'military',
    rank: 'Korporaal',
    functionDomain: 'Cyber Security',
    locations: ['Amsterdam'],
    roleDescription: 'Je analyseert dreigingen en bewaakt netwerken.',
    dailyActivities: 'Monitoren, incident response en rapportage.',
    weeklyCalendar: [],
    workDistribution: [{ category: 'Security', percentage: 100 }],
    skills: [{ skillName: 'SIEM', level: 5, description: 'Security monitoring' }],
    contactPerson: { name: 'Sara Bakker', email: 'sara.bakker@mindef.nl', phone: '0698765432' },
  },
  {
    id: 'civ-1',
    title: 'Backend Developer',
    department: 'Bestuursstaf',
    personnelType: 'civilian',
    scale: 'Schaal 10',
    functionDomain: 'Software Development',
    locations: ['Utrecht'],
    roleDescription: 'Je ontwikkelt en onderhoudt REST API\'s.',
    dailyActivities: 'API-ontwerp, implementatie en testen.',
    weeklyCalendar: [],
    workDistribution: [{ category: 'Ontwikkeling', percentage: 100 }],
    skills: [{ skillName: 'Node.js', level: 4, description: 'Backend runtime' }],
    contactPerson: { name: 'Piet Jansen', email: 'piet.jansen@mindef.nl', phone: '0611112222' },
  },
  {
    id: 'civ-2',
    title: 'Data Scientist',
    department: 'Defensie Materieel Organisatie',
    personnelType: 'civilian',
    scale: 'Schaal 11',
    functionDomain: 'Data Science',
    locations: ['Den Haag'],
    roleDescription: 'Je bouwt voorspellende modellen voor logistiek.',
    dailyActivities: 'Data-analyse, modellering en visualisatie.',
    weeklyCalendar: [],
    workDistribution: [{ category: 'Analyse', percentage: 100 }],
    skills: [{ skillName: 'Python', level: 5, description: 'Data science' }],
    contactPerson: { name: 'Lisa Smit', email: 'lisa.smit@mindef.nl', phone: '0633334444' },
  },
];

/**
 * In-memory repository backed by the fixture above. Drop-in replacement for the
 * real {@link VACANCY_REPOSITORY} provider in TestBed.
 */
export class TestVacancyRepository implements VacancyRepository {
  constructor(private readonly data: Vacancy[] = TEST_VACANCIES) {}

  getAll(): Observable<Vacancy[]> {
    return of(this.data);
  }

  getById(id: string): Observable<Vacancy | undefined> {
    return of(this.data.find(v => v.id === id));
  }
}
