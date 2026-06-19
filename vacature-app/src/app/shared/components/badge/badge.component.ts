import { Component, input, ChangeDetectionStrategy } from '@angular/core';

type BadgeVariant = 'military' | 'civilian' | 'domain' | 'location' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');

  variantClass(): string {
    return `badge badge-${this.variant()}`;
  }
}
