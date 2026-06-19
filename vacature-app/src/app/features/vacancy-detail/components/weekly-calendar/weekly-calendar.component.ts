import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { WeeklyActivity, Day } from '../../../../core/models/vacancy.model';

const DAYS: { key: Day; label: string }[] = [
  { key: 'monday',    label: 'Ma' },
  { key: 'tuesday',   label: 'Di' },
  { key: 'wednesday', label: 'Wo' },
  { key: 'thursday',  label: 'Do' },
  { key: 'friday',    label: 'Vr' },
];

const ACTIVITY_COLORS: Record<string, string> = {
  'stand':       '#3B82F6',
  'planning':    '#1E40AF',
  'review':      '#8B5CF6',
  'retro':       '#A855F7',
  'development': '#10B981',
  'ontwikkeling':'#10B981',
  'feature':     '#10B981',
  'bug':         '#F59E0B',
  'testing':     '#F59E0B',
  'test':        '#F59E0B',
  'security':    '#EF4444',
  'incident':    '#EF4444',
  'siem':        '#EF4444',
  'doc':         '#64748B',
  'rapport':     '#64748B',
  'coach':       '#EC4899',
  'training':    '#EC4899',
  'analyse':     '#06B6D4',
  'data':        '#06B6D4',
  'model':       '#06B6D4',
  'arch':        '#F97316',
  'default':     '#6366F1',
};

const START_HOUR = 8;
const END_HOUR   = 18;
const PX_PER_MIN = 1;
const CALENDAR_HEIGHT = (END_HOUR - START_HOUR) * 60 * PX_PER_MIN;

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function getColor(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, color] of Object.entries(ACTIVITY_COLORS)) {
    if (key !== 'default' && lower.includes(key)) return color;
  }
  return ACTIVITY_COLORS['default'];
}

interface CalendarBlock {
  activity: WeeklyActivity;
  color: string;
  topPx: number;
  heightPx: number;
}

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekly-calendar.component.html',
  styleUrl: './weekly-calendar.component.scss',
})
export class WeeklyCalendarComponent {
  readonly activities = input.required<WeeklyActivity[]>();

  readonly days = DAYS;
  readonly hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  /** Exposed for template bindings (replaces TS template-literal interpolation). */
  readonly startHour = START_HOUR;
  readonly calendarHeight = CALENDAR_HEIGHT;

  blocksForDay(day: Day): CalendarBlock[] {
    return this.activities()
      .filter(a => a.day === day)
      .map(a => {
        const startMin = timeToMinutes(a.startTime);
        const endMin   = timeToMinutes(a.endTime);
        return {
          activity: a,
          color:    getColor(a.title),
          topPx:    (startMin - START_HOUR * 60) * PX_PER_MIN,
          heightPx: Math.max((endMin - startMin) * PX_PER_MIN, 20),
        };
      });
  }
}
