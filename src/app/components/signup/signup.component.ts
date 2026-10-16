import { Component, inject } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { CustomInputComponent } from '../ui-components/custom-input/custom-input.component';

@Component({
  selector: 'app-signup',

  standalone: true,

  imports: [ReactiveFormsModule, CustomInputComponent],

  templateUrl: './signup.component.html',

  styleUrl: './signup.component.css',
})
export class SignupComponent {
  /*
   * =========================
   * PASSWORD MATCH VALIDATOR
   * =========================
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;

    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : {
          passwordMismatch: true,
        };
  }

  /*
   * Inject AuthService
   */
  private authService = inject(AuthService);

  /*
   * Inject Router
   */
  private router = inject(Router);

  /*
   * Maximum DOB allowed
   */
  public maxDate = new Date().toISOString().split('T')[0];

  /*
   * Error shown when
   * username already exists
   */
  public errorMessage = '';

  /*
   * =========================
   * SIGNUP FORM
   * =========================
   */

  public signupForm = new FormGroup(
    {
      /*
       * Name
       */
      name: new FormControl('', {
        nonNullable: true,

        validators: [Validators.required, Validators.minLength(2)],
      }),

      /*
       * Username
       *
       * No pattern restriction.
       *
       * Therefore numbers and special
       * characters are allowed.
       */
      username: new FormControl('', {
        nonNullable: true,

        validators: [Validators.required, Validators.minLength(3)],
      }),

      /*
       * Gender
       */
      gender: new FormControl('', {
        nonNullable: true,

        validators: [Validators.required],
      }),

      /*
       * Date of Birth
       */
      dob: new FormControl('', {
        nonNullable: true,

        validators: [Validators.required],
      }),

      /*
       * Password
       */
      password: new FormControl('', {
        nonNullable: true,

        validators: [Validators.required, Validators.minLength(6)],
      }),

      /*
       * Confirm Password
       */
      confirmPassword: new FormControl('', {
        nonNullable: true,

        validators: [Validators.required],
      }),
    },

    {
      validators: this.passwordMatchValidator,
    },
  );

  /*
   * =========================
   * SIGNUP
   * =========================
   */

  public signup(): void {
    /*
     * Clear previous error
     */
    this.errorMessage = '';

    /*
     * Check form validation
     */
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();

      return;
    }

    /*
     * Get form data
     */
    const formData = this.signupForm.getRawValue();

    /*
     * Register the user
     */
    const isRegistered = this.authService.signup({
      name: formData.name.trim(),

      username: formData.username.trim(),

      gender: formData.gender,

      dob: formData.dob,

      password: formData.password,
    });

    /*
     * Username already exists
     */
    if (!isRegistered) {
      this.errorMessage = 'Username already exists. Please choose another username.';

      /*
       * Set custom validation error
       * on username field
       */
      this.signupForm.controls.username.setErrors({
        usernameTaken: true,
      });

      this.signupForm.controls.username.markAsTouched();

      return;
    }

    /*
     * Signup successful
     *
     * Redirect to login
     */
    this.router.navigate(['/login']);
  }

  /*
   * =========================
   * GO TO LOGIN
   * =========================
   */

  public goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
