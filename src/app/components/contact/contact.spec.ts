import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CONTACT_SOCIALS, Contact } from './contact';

describe('Contact', () => {
  let fixture: ComponentFixture<Contact>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  const form = () => (fixture.componentInstance as unknown as { form: import('@angular/forms').FormGroup }).form;

  it('starts invalid and empty', () => {
    expect(form().invalid).toBe(true);
    expect(el.querySelector('form.form')).toBeTruthy();
  });

  it('rejects a malformed email and a too-short message', () => {
    form().patchValue({ name: 'Ada', email: 'nope', message: 'short' });
    expect(form().controls['email'].valid).toBe(false);
    expect(form().controls['message'].valid).toBe(false);
  });

  it('accepts a complete enquiry', () => {
    form().patchValue({
      name: 'Ada Lovelace',
      email: 'ada@studio.com',
      message: 'We need a WebGL product page for an October launch.',
    });
    expect(form().valid).toBe(true);
  });

  it('renders every social link', () => {
    expect(el.querySelectorAll('.social').length).toBe(CONTACT_SOCIALS.length);
  });
});
