import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkDistributionComponent } from './work-distribution.component';
import { WorkDistribution } from '../../../../core/models/vacancy.model';

const mockDistributions: WorkDistribution[] = [
  { category: 'Development', percentage: 60 },
  { category: 'Testing', percentage: 25 },
  { category: 'Meetings', percentage: 15 },
];

describe('WorkDistributionComponent', () => {
  let fixture: ComponentFixture<WorkDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkDistributionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkDistributionComponent);
    fixture.componentRef.setInput('distributions', mockDistributions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should compute segments for each distribution', () => {
    expect(fixture.componentInstance.segments().length).toBe(3);
  });

  it('should assign colors to segments', () => {
    const segments = fixture.componentInstance.segments();
    segments.forEach(seg => expect(seg.color).toBeTruthy());
  });
});
