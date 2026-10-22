import { Routes } from '@angular/router';

import { LoginComponent, SignupComponent, adminGuard, authGuard } from '@employee-management/auth-feature-auth';
import { EmployeeComponent, EmployeeListComponent } from '@employee-management/employee-feature-employees';
import { EmployeeDetailsComponent } from '@employee-management/employee-feature-details';
import { HelpComponent } from '@employee-management/settings-feature-help';
import { EmployeeLayoutComponent } from './components/employee-layout/employee-layout.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'employees',
    component: EmployeeLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'table',
        pathMatch: 'full',
      },
      {
        path: 'table',
        component: EmployeeComponent,
      },
      {
        path: 'list',
        component: EmployeeListComponent,
        children: [
          {
            path: ':id',
            component: EmployeeDetailsComponent,
          },
        ],
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('@employee-management/employee-feature-analytics').then((m) => m.EmployeeAnalysisComponent),
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'access-management',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@employee-management/access-management-feature').then(
            (m) => m.AccessManagementComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
