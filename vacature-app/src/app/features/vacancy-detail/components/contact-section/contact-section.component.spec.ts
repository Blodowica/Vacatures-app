import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ContactSectionComponent } from './contact-section.component';
import { ContactPerson } from '../../../../core/models/vacancy.model';

const mockContact: ContactPerson = {
  name: 'Kapitein Mark de Vries',
  email: 'm.devries@defensie.nl',
  phone: '070-316 4001',
};

describe('ContactSectionComponent', () => {
  let fixture: ComponentFixture<ContactSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSectionComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSectionComponent);
    fixture.componentRef.setInput('contactPerson', mockContact);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display contact details immediately', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Kapitein Mark de Vries');
    expect(el.textContent).toContain('m.devries@defensie.nl');
    expect(el.textContent).toContain('070-316 4001');
  });

  it('should default to light theme', () => {
    expect(fixture.componentInstance.theme()).toBe('light');
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.contact--dark')).toBeNull();
  });

  it('should apply dark theme class', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.contact--dark')).toBeTruthy();
  });

  it('should compute initials from name', () => {
    expect(fixture.componentInstance.initials()).toBe('MD');
  });

  it('should render a mailto link for the email', () => {
    const el: HTMLElement = fixture.nativeElement;
    const link = el.querySelector<HTMLAnchorElement>('a[href^="mailto:"]');
    expect(link?.href).toContain('m.devries@defensie.nl');
  });

  it('should render a tel link for the phone', () => {
    const el: HTMLElement = fixture.nativeElement;
    const link = el.querySelector<HTMLAnchorElement>('a[href^="tel:"]');
    expect(link?.href).toContain('070');
  });
});
