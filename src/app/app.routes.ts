import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeeComponent } from './components/employee-component/employee-component.component';
import { EmployeeLayoutComponent } from './components/employee-layout/employee-layout.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';

import { HelpComponent } from './components/help/help.component';
import { AboutComponent } from './components/about/about.component';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

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
          import('./components/employee-analysis/employee-analysis.component').then(
            (m) => m.EmployeeAnalysisComponent,
          ),
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
          import('./components/access-management/access-management.component').then(
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
