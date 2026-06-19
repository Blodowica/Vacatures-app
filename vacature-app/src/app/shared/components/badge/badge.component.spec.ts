import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should default to neutral variant', () => {
    expect(fixture.componentInstance.variant()).toBe('neutral');
  });

  it('should apply the correct variant class', () => {
    fixture.componentRef.setInput('variant', 'military');
    fixture.detectChanges();
    const span: HTMLElement = fixture.nativeElement.querySelector('.badge');
    expect(span.classList).toContain('badge-military');
  });
});
