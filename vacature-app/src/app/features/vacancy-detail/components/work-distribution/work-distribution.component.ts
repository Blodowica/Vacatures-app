import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { WorkDistribution } from '../../../../core/models/vacancy.model';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];
const RADIUS = 35;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface DonutSegment extends WorkDistribution {
  color: string;
  dasharray: string;
  dashoffset: number;
}

@Component({
  selector: 'app-work-distribution',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './work-distribution.component.html',
  styleUrl: './work-distribution.component.scss',
})
export class WorkDistributionComponent {
  readonly distributions = input.required<WorkDistribution[]>();

  readonly segments = computed<DonutSegment[]>(() => {
    let cumulative = 0;
    return this.distributions().map((d, i) => {
      const length = (d.percentage / 100) * CIRCUMFERENCE;
      const gap = CIRCUMFERENCE - length;
      const dashoffset = -(cumulative / 100) * CIRCUMFERENCE;
      cumulative += d.percentage;
      return {
        ...d,
        color: CHART_COLORS[i % CHART_COLORS.length],
        dasharray: `${length.toFixed(2)} ${gap.toFixed(2)}`,
        dashoffset,
      };
    });
  });
}
