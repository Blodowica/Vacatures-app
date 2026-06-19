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
  template: `
    <div class="distribution">
      <div class="chart-wrap">
        <svg viewBox="0 0 100 100" class="donut">
          <circle cx="50" cy="50" r="35" fill="none" stroke="#F1F5F9" stroke-width="10"/>
          <g transform="rotate(-90, 50, 50)">
            @for (seg of segments(); track seg.category) {
              <circle
                cx="50" cy="50" r="35"
                fill="none"
                [attr.stroke]="seg.color"
                stroke-width="10"
                stroke-linecap="round"
                [attr.stroke-dasharray]="seg.dasharray"
                [attr.stroke-dashoffset]="seg.dashoffset"
              >
                <title>{{ seg.category }}: {{ seg.percentage }}%</title>
              </circle>
            }
          </g>
          <text x="50" y="46" text-anchor="middle" class="center-top">Tijd</text>
          <text x="50" y="55" text-anchor="middle" class="center-bottom">verdeling</text>
        </svg>
      </div>

      <div class="legend">
        @for (seg of segments(); track seg.category) {
          <div class="legend-row">
            <span class="legend-dot" [style.background]="seg.color"></span>
            <span class="legend-name">{{ seg.category }}</span>
            <span class="legend-pct" [style.color]="seg.color">{{ seg.percentage }}%</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .distribution {
      display: flex;
      gap: 2rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .chart-wrap {
      flex-shrink: 0;
      width: 200px;
      height: 200px;
    }
    .donut { width: 100%; height: 100%; }
    .center-top {
      font-size: 9px;
      font-weight: 700;
      fill: #0F2342;
    }
    .center-bottom {
      font-size: 7px;
      fill: #64748B;
    }
    .legend {
      flex: 1;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .legend-row {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .legend-name {
      flex: 1;
      font-size: 0.875rem;
      color: #374151;
    }
    .legend-pct {
      font-size: 0.875rem;
      font-weight: 700;
      min-width: 38px;
      text-align: right;
    }
    @media (max-width: 480px) {
      .distribution { flex-direction: column; }
      .chart-wrap { width: 160px; height: 160px; }
    }
  `]
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
