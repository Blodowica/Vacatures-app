import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { WeeklyActivity, Day } from '../../../../core/models/vacancy.model';

const DAYS: { key: Day; label: string }[] = [
  { key: 'monday', label: 'Ma' },
  { key: 'tuesday', label: 'Di' },
  { key: 'wednesday', label: 'Wo' },
  { key: 'thursday', label: 'Do' },
  { key: 'friday', label: 'Vr' },
];

const ACTIVITY_COLORS: Record<string, string> = {
  'stand': '#3B82F6',
  'planning': '#1E40AF',
  'review': '#8B5CF6',
  'retro': '#A855F7',
  'development': '#10B981',
  'ontwikkeling': '#10B981',
  'feature': '#10B981',
  'bug': '#F59E0B',
  'testing': '#F59E0B',
  'test': '#F59E0B',
  'security': '#EF4444',
  'incident': '#EF4444',
  'siem': '#EF4444',
  'doc': '#64748B',
  'rapport': '#64748B',
  'coach': '#EC4899',
  'training': '#EC4899',
  'analyse': '#06B6D4',
  'data': '#06B6D4',
  'model': '#06B6D4',
  'arch': '#F97316',
  'default': '#6366F1',
};

const START_HOUR = 8;
const END_HOUR = 18;
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
const PX_PER_MIN = 1;
const CALENDAR_HEIGHT = TOTAL_MINUTES * PX_PER_MIN;

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
  template: `
    <div class="calendar-outer">
      <div class="calendar-scroll">
        <div class="calendar">
          <!-- Time axis -->
          <div class="time-axis">
            @for (hour of hours; track hour) {
              <div class="time-label" [style.top.px]="(hour - ${START_HOUR}) * 60">
                {{ hour }}:00
              </div>
            }
          </div>

          <!-- Day columns -->
          @for (day of days; track day.key) {
            <div class="day-col">
              <div class="day-header">{{ day.label }}</div>
              <div class="day-body" [style.height.px]="${CALENDAR_HEIGHT}">
                <!-- Hour grid lines -->
                @for (hour of hours; track hour) {
                  <div class="grid-line" [style.top.px]="(hour - ${START_HOUR}) * 60"></div>
                }
                <!-- Activity blocks -->
                @for (block of blocksForDay(day.key); track block.activity.title + block.activity.startTime) {
                  <div
                    class="activity-block"
                    [style.top.px]="block.topPx"
                    [style.height.px]="block.heightPx"
                    [style.border-left-color]="block.color"
                    [style.background]="block.color + '18'"
                    [title]="block.activity.title + ' (' + block.activity.startTime + '-' + block.activity.endTime + '): ' + block.activity.description"
                  >
                    <div class="block-time">{{ block.activity.startTime }}</div>
                    @if (block.heightPx >= 35) {
                      <div class="block-title">{{ block.activity.title }}</div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-outer {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
    }
    .calendar-scroll { min-width: 560px; }
    .calendar {
      display: flex;
      background: #fff;
    }
    .time-axis {
      width: 52px;
      flex-shrink: 0;
      position: relative;
      height: ${CALENDAR_HEIGHT + 40}px;
      margin-top: 40px;
      border-right: 1px solid #E2E8F0;
    }
    .time-label {
      position: absolute;
      right: 8px;
      font-size: 0.6875rem;
      color: #94A3B8;
      transform: translateY(-50%);
      white-space: nowrap;
    }
    .day-col {
      flex: 1;
      border-right: 1px solid #F1F5F9;
    }
    .day-col:last-child { border-right: none; }
    .day-header {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 700;
      color: #0F2342;
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
      position: sticky;
      top: 0;
    }
    .day-body {
      position: relative;
    }
    .grid-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      background: #F1F5F9;
    }
    .activity-block {
      position: absolute;
      left: 4px;
      right: 4px;
      border-left: 3px solid;
      border-radius: 4px;
      padding: 3px 5px;
      overflow: hidden;
      cursor: default;
      transition: filter 0.15s;
    }
    .activity-block:hover {
      filter: brightness(0.95);
      z-index: 2;
    }
    .block-time {
      font-size: 0.625rem;
      color: #374151;
      font-weight: 600;
      line-height: 1.2;
    }
    .block-title {
      font-size: 0.6875rem;
      color: #1E293B;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 1px;
    }
  `]
})
export class WeeklyCalendarComponent {
  readonly activities = input.required<WeeklyActivity[]>();

  readonly days = DAYS;
  readonly hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  blocksForDay(day: Day): CalendarBlock[] {
    return this.activities()
      .filter(a => a.day === day)
      .map(a => {
        const startMin = timeToMinutes(a.startTime);
        const endMin = timeToMinutes(a.endTime);
        return {
          activity: a,
          color: getColor(a.title),
          topPx: (startMin - START_HOUR * 60) * PX_PER_MIN,
          heightPx: Math.max((endMin - startMin) * PX_PER_MIN, 20),
        };
      });
  }
}
