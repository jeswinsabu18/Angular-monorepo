
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css',
})
export class EmployeeTableComponent {
  @Input() public employees: Employee[] = [];

  @Input() public sortField: 'employeeId' | 'employeeAge' = 'employeeId';

  @Input() public sortDirection: 'asc' | 'desc' = 'asc';

  @Input() public canEdit = true;

  @Input() public canDelete = true;

  @Output()
  public sortChanged = new EventEmitter<'employeeId' | 'employeeAge'>();

  @Output()
  public editEmployee = new EventEmitter<Employee>();

  @Output()
  public deleteEmployee = new EventEmitter<number>();
}
