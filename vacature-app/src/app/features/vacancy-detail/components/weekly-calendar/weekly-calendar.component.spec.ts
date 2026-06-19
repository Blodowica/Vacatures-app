import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyCalendarComponent } from './weekly-calendar.component';
import { WeeklyActivity } from '../../../../core/models/vacancy.model';

const mockActivities: WeeklyActivity[] = [
  { day: 'monday', startTime: '09:00', endTime: '10:00', title: 'Stand-up', description: 'Daily stand-up' },
  { day: 'wednesday', startTime: '13:00', endTime: '15:00', title: 'Development', description: 'Feature work' },
];

describe('WeeklyCalendarComponent', () => {
  let fixture: ComponentFixture<WeeklyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyCalendarComponent);
    fixture.componentRef.setInput('activities', mockActivities);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display all 5 day columns', () => {
    expect(fixture.componentInstance.days.length).toBe(5);
  });

  it('should return blocks for a specific day', () => {
    const mondayBlocks = fixture.componentInstance.blocksForDay('monday');
    expect(mondayBlocks.length).toBe(1);
    expect(mondayBlocks[0].activity.title).toBe('Stand-up');
  });

  it('should return empty array for days with no activities', () => {
    const fridayBlocks = fixture.componentInstance.blocksForDay('friday');
    expect(fridayBlocks.length).toBe(0);
  });
});
