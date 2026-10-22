import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EmployeeService } from '@employee-management/employee-data';
import { CustomInputComponent } from '@employee-management/shared-ui';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CustomInputComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);

  public readonly searchTerm = signal('');

  public readonly employees = this.employeeService.employees;

  public readonly filteredEmployees = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    if (!query) {
      return this.employees();
    }

    return this.employees().filter((employee) =>
      [
        employee.employeeName,
        employee.employeeId.toString(),
        employee.employeeRole,
        employee.employeeDepartment,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  });

  public onSearch(value: string): void {
    this.searchTerm.set(value);
  }
}
