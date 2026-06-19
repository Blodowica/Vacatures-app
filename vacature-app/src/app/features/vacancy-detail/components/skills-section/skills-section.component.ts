import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Skill } from '../../../../core/models/vacancy.model';

const LEVEL_LABELS = ['', 'Basiskennis', 'Basis', 'Gevorderd', 'Expert', 'Meester'];
const LEVEL_COLORS = ['', '#94A3B8', '#60A5FA', '#34D399', '#F59E0B', '#EF4444'];

@Component({
  selector: 'app-skills-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skills">
      @for (skill of skills(); track skill.skillName) {
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name">{{ skill.skillName }}</span>
            <span class="skill-level-label" [style.color]="levelColor(skill.level)">
              {{ levelLabel(skill.level) }}
            </span>
          </div>
          <p class="skill-desc">{{ skill.description }}</p>
          <div class="skill-bar-track">
            <div
              class="skill-bar-fill"
              [style.width.%]="skill.level * 20"
              [style.background-color]="levelColor(skill.level)"
            ></div>
          </div>
          <div class="skill-dots">
            @for (dot of [1,2,3,4,5]; track dot) {
              <span class="skill-dot" [class.filled]="dot <= skill.level" [style.background-color]="dot <= skill.level ? levelColor(skill.level) : undefined"></span>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .skills {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .skill-item {}
    .skill-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    .skill-name {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #0F2342;
    }
    .skill-level-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .skill-desc {
      font-size: 0.8125rem;
      color: #64748B;
      margin: 0 0 0.5rem;
    }
    .skill-bar-track {
      height: 6px;
      background: #F1F5F9;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .skill-bar-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
    }
    .skill-dots {
      display: flex;
      gap: 4px;
    }
    .skill-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #E2E8F0;
      transition: background 0.2s;
    }
  `]
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
