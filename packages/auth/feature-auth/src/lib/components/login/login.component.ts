import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@employee-management/auth-data';
import { CustomInputComponent } from '@employee-management/shared-ui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public loginForm = new FormGroup({
    userName: new FormControl('', {
      nonNullable: true,

      validators: [Validators.required],
    }),

    userPassword: new FormControl('', {
      nonNullable: true,

      validators: [Validators.required],
    }),
  });

  public errorMessage = '';

  private authService = inject(AuthService);

  private router = inject(Router);

  /*
   * Login
   */
  public login(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    const { userName, userPassword } = this.loginForm.getRawValue();

    const isValidUser = this.authService.login(userName, userPassword);

    if (isValidUser) {
      this.router.navigate(['/employees']);
    } else {
      this.errorMessage = 'Invalid user name or password';
    }
  }

  /*
   * Navigate to Signup
   */
  public goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
