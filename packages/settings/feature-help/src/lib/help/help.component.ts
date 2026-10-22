import { Component } from '@angular/core';

import { PageShellComponent } from '@employee-management/shared-ui';

interface HelpStep {
  title: string;
  image: string;
  alt: string;
  guidelines: string[];
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [PageShellComponent],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css',
})
export class HelpComponent {
  /* Screenshots live in src/assets/help */
  public readonly steps: HelpStep[] = [
    {
      title: 'Login',
      image: 'assets/help/01-login.png',
      alt: 'Login page',
      guidelines: [
        'Enter your user name and password, then select Login.',
        'No account yet? Select Create Account.',
        'Your session ends after 10 minutes; sign in again to continue.',
      ],
    },
    {
      title: 'Create an account',
      image: 'assets/help/02-signup.png',
      alt: 'Create account page',
      guidelines: [
        'Name needs at least 2 characters and username at least 3.',
        'Choose your gender and date of birth.',
        'Password needs at least 6 characters; type it again to confirm.',
        'New accounts can view and search only, until an administrator grants Add, Edit or Delete.',
      ],
    },
    {
      title: 'Employee table',
      image: 'assets/help/03-employee-table.png',
      alt: 'Employee table page',
      guidelines: [
        'Search by employee name or ID using the search box.',
        'Select the ID or Age heading to sort; select it again to reverse.',
        'Edit and Delete actions appear only when your account has the matching permission.',
        'The Add Employee button appears only when your account has Add permission.',
        'The top-right icons open your profile, settings and the light/dark theme.',
      ],
    },
    {
      title: 'Sidebar',
      image: 'assets/help/04-sidebar-expanded.png',
      alt: 'Expanded sidebar showing Employee Table and Employee List',
      guidelines: [
        'Select the menu icon at the top of the sidebar to expand or collapse it.',
        'Expanded, it shows Employee Table and Employee List by name.',
        'Collapsed, it shows icons only. Your choice is remembered.',
      ],
    },
    {
      title: 'Employee list',
      image: 'assets/help/05-employee-list.png',
      alt: 'Employee list with details panel',
      guidelines: [
        'Search by name, ID, role or department.',
        'Select a person to see their full details on the right.',
      ],
    },
    {
      title: 'Add or edit an employee',
      image: 'assets/help/06-add-employee.png',
      alt: 'Add employee form',
      guidelines: [
        'Employee ID must be a positive whole number that is not already used. It is locked while editing.',
        'Name accepts letters and spaces only.',
        'Age must be a whole number from 18 to 70.',
        'Department and Role are required.',
        'Select Save to apply, or Cancel to discard.',
      ],
    },
    {
      title: 'Delete an employee',
      image: 'assets/help/07-delete-confirm.png',
      alt: 'Delete confirmation window',
      guidelines: [
        'A confirmation window always appears first.',
        'Select Delete to remove the employee, or Cancel to keep it.',
        'Deleting cannot be undone.',
      ],
    },
    {
      title: 'Settings menu',
      image: 'assets/help/08-settings-menu.png',
      alt: 'Settings menu',
      guidelines: [
        'Help opens this guide and About shows version and data details.',
        'Access Management is shown to administrators only.',
      ],
    },
    {
      title: 'Profile and logout',
      image: 'assets/help/09-profile.png',
      alt: 'Profile popup',
      guidelines: [
        'Shows your name, username, gender and date of birth.',
        'Select Logout when you finish, especially on a shared computer.',
      ],
    },
    {
      title: 'Access management (administrators)',
      image: 'assets/help/10-access-management.png',
      alt: 'Access management page',
      guidelines: [
        'Tick a box to grant Add, Edit or Delete to a user; untick to remove it.',
        'Changes save immediately.',
        'Administrators always have all permissions.',
      ],
    },
  ];
}
