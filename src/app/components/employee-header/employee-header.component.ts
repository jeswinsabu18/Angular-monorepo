import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, RegisteredUser } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-employee-header',
  standalone: true,
  templateUrl: './employee-header.component.html',
  styleUrl: './employee-header.component.css',
})
export class EmployeeHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public themeService = inject(ThemeService);

  public title = 'Employee Management';

  public isProfileOpen = false;
  public isSettingsOpen = false;

  public get loggedInUser(): RegisteredUser | null {
    return this.authService.getLoggedInUser();
  }

  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
    this.isSettingsOpen = false;
  }

  public toggleSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
    this.isProfileOpen = false;
  }

  public openSettingsPage(page: 'access-management' | 'help' | 'about'): void {
    this.isSettingsOpen = false;

    if (page === 'access-management' && !this.isAdmin) {
      return;
    }

    this.router.navigate(['/employees', page]);
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
