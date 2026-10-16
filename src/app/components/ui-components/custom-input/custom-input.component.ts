import { Component, forwardRef, inject, Injector, Input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

/*
 * Input types supported by the reusable text input.
 * (Number, date, checkbox, radio and file inputs stay native.)
 */
export type CustomInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';

/*
 * Used to generate a unique id when the parent does not provide `inputId`.
 */
let nextId = 0;

@Component({
  selector: 'app-custom-input',
  standalone: true,
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor, OnInit {
  /* Visible label. When empty, no <label> is rendered. */
  @Input() public label = '';

  /* id of the native input (also used by the label's `for`). */
  @Input() public inputId = `app-custom-input-${nextId++}`;

  @Input() public type: CustomInputType = 'text';

  @Input() public placeholder = '';

  /* Standard HTML autocomplete token, e.g. "username" or "new-password". */
  @Input() public autocomplete = '';

  /* Accessible name for inputs that have no visible label (e.g. search boxes). */
  @Input() public ariaLabel = '';

  /* Disables the input. A disabled FormControl also disables it. */
  @Input() public disabled = false;

  /* Marks the field as required for assistive technology (and shows an asterisk). */
  @Input() public required = false;

  /*
   * Forces the invalid styling. The invalid styling is also applied
   * automatically when the bound form control is invalid and touched.
   */
  @Input() public invalid = false;

  /* Optional error text shown below the input. */
  @Input() public errorMessage = '';

  /* Current text shown in the input. */
  protected readonly value = signal('');

  /* Disabled state coming from the bound form control. */
  protected readonly formDisabled = signal(false);

  private readonly injector = inject(Injector);

  /*
   * The NgControl is looked up lazily (not injected in the constructor)
   * to avoid a circular dependency with NG_VALUE_ACCESSOR.
   */
  private ngControl: NgControl | null = null;

  private onChange: (value: string) => void = () => undefined;

  private onTouched: () => void = () => undefined;

  public ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
  }

  protected get errorId(): string {
    return `${this.inputId}-error`;
  }

  protected get isDisabled(): boolean {
    return this.disabled || this.formDisabled();
  }

  /* Invalid styling follows the real control state (invalid + touched). */
  protected get showInvalid(): boolean {
    const control = this.ngControl?.control;

    return this.invalid || !!(control && control.invalid && control.touched);
  }

  protected onInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;

    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  /*
   * ControlValueAccessor
   */
  public writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
