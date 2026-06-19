import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ContactPerson } from '../../../../core/models/vacancy.model';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
})
export class ContactSectionComponent {
  readonly contactPerson = input.required<ContactPerson>();
  readonly theme = input<'light' | 'dark'>('light');

  initials(): string {
    return this.contactPerson().name
      .split(' ')
      .filter(w => /^[A-Za-z]/.test(w))
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }
}
