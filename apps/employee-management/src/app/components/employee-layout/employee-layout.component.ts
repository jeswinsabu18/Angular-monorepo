import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { EmployeeSidebarComponent } from '../employee-sidebar/employee-sidebar.component';

import { EmployeeHeaderComponent } from '../employee-header/employee-header.component';

@Component({
  selector: 'app-employee-layout',

  standalone: true,

  imports: [RouterOutlet, EmployeeSidebarComponent, EmployeeHeaderComponent],

  templateUrl: './employee-layout.component.html',

  styleUrl: './employee-layout.component.css',
})
export class EmployeeLayoutComponent {}
