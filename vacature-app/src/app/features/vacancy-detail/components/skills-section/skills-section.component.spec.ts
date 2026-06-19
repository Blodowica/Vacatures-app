import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsSectionComponent } from './skills-section.component';
import { Skill } from '../../../../core/models/vacancy.model';

const mockSkills: Skill[] = [
  { skillName: 'TypeScript', description: 'Gevorderd niveau TypeScript', level: 3 },
  { skillName: 'Angular', description: 'Expert niveau Angular', level: 4 },
];

describe('SkillsSectionComponent', () => {
  let fixture: ComponentFixture<SkillsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsSectionComponent);
    fixture.componentRef.setInput('skills', mockSkills);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render all skills', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.skill-item').length).toBe(2);
  });

  it('should return correct level label', () => {
    expect(fixture.componentInstance.levelLabel(1)).toBe('Basiskennis');
    expect(fixture.componentInstance.levelLabel(5)).toBe('Meester');
  });
});
