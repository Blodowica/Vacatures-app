import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Skill } from '../../../../core/models/vacancy.model';

const LEVEL_LABELS = ['', 'Basiskennis', 'Basis', 'Gevorderd', 'Expert', 'Meester'];
const LEVEL_COLORS = ['', '#94A3B8', '#60A5FA', '#34D399', '#F59E0B', '#EF4444'];

@Component({
  selector: 'app-skills-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills-section.component.html',
  styleUrl: './skills-section.component.scss',
})
export class SkillsSectionComponent {
  readonly skills = input.required<Skill[]>();

  levelLabel(level: number): string {
    return LEVEL_LABELS[level] ?? '';
  }

  levelColor(level: number): string {
    return LEVEL_COLORS[level] ?? '#94A3B8';
  }
}
