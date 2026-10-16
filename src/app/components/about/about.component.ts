import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { PageShellComponent } from '../page-shell/page-shell.component';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface StorageItem {
  data: string;
  location: string;
  purpose: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PageShellComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly authService = inject(AuthService);

  public readonly appName = 'Employee Management System';
  public readonly appVersion = '1.0.0';
  public readonly releaseStatus = 'Prototype';
  public readonly lastUpdated = 'October 2026';
  public readonly sessionMinutes = 10;

  public readonly features: Feature[] = [
    {
      icon: 'table',
      title: 'Table and list views',
      description: 'Browse employees as a sortable table or as a list with a details panel.',
    },
    {
      icon: 'search',
      title: 'Instant search',
      description:
        'Filter records by name or ID as you type; the list view also matches role and department.',
    },
    {
      icon: 'edit',
      title: 'Add, edit and delete',
      description: 'Validated forms and a delete confirmation help keep employee records accurate.',
    },
    {
      icon: 'profile',
      title: 'Accounts and sessions',
      description:
        'Sign up, log in, and view your profile. Sessions expire automatically for safety.',
    },
    {
      icon: 'settings',
      title: 'Permission-based access',
      description: 'Administrators grant Add, Edit and Delete rights to each user independently.',
    },
    {
      icon: 'moon',
      title: 'Light and dark themes',
      description: 'Switch themes from the header; your preference is remembered.',
    },
  ];

  public readonly storage: StorageItem[] = [
    {
      data: 'Employee records',
      location: 'Browser local storage',
      purpose: 'Keeps your changes after you close the page',
    },
    {
      data: 'Registered users and permissions',
      location: 'Browser local storage',
      purpose: 'Lets accounts and access settings persist',
    },
    {
      data: 'Theme preference',
      location: 'Browser local storage',
      purpose: 'Remembers light or dark mode',
    },
    {
      data: 'Login session',
      location: 'Browser session storage',
      purpose: 'Cleared when the tab closes or the session expires',
    },
  ];

  public readonly technologies: string[] = [
    'Angular',
    'TypeScript',
    'Standalone components',
    'Reactive forms',
    'Router and route guards',
    'Signals',
    'CSS theme variables',
  ];

  public readonly employeeCount = computed(() => this.employeeService.employees().length);

  public get userCount(): number {
    return this.authService.getUsersForAccessManagement().length;
  }

  public get currentUserName(): string {
    return this.authService.getLoggedInUser()?.name ?? 'Not available';
  }

  public get currentRole(): string {
    return this.authService.isAdmin() ? 'Administrator' : 'User';
  }
}
