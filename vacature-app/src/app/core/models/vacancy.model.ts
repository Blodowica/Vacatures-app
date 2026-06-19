export type PersonnelType = 'military' | 'civilian';
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface WeeklyActivity {
  day: Day;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface WorkDistribution {
  category: string;
  percentage: number;
}

export interface Skill {
  skillName: string;
  level: 1 | 2 | 3 | 4 | 5;
  description: string;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  personnelType: PersonnelType;
  rank?: string;
  scale?: string;
  functionDomain: string;
  locations: string[];
  roleDescription: string;
  dailyActivities: string;
  weeklyCalendar: WeeklyActivity[];
  workDistribution: WorkDistribution[];
  skills: Skill[];
  contactPerson: ContactPerson;
}
