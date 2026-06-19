import { Component, input, ChangeDetectionStrategy } from '@angular/core';

type BadgeVariant = 'military' | 'civilian' | 'domain' | 'location' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class]="variantClass()">
      <ng-content />
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      white-space: nowrap;
    }
    .badge-military {
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FCD34D;
    }
    .badge-civilian {
      background: #CCFBF1;
      color: #0F766E;
      border: 1px solid #5EEAD4;
    }
    .badge-domain {
      background: #EDE9FE;
      color: #5B21B6;
      border: 1px solid #C4B5FD;
    }
    .badge-location {
      background: #F1F5F9;
      color: #475569;
      border: 1px solid #CBD5E1;
    }
    .badge-neutral {
      background: #F8FAFC;
      color: #64748B;
      border: 1px solid #E2E8F0;
    }
  `]
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');

  variantClass(): string {
    return `badge badge-${this.variant()}`;
  }
}
