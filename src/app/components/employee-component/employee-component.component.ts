
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { EmployeeFormModalComponent } from '../ui-components/employee-form-modal/employee-form-modal.component';
import { EmployeeTableComponent } from '../employee-table/employee-table.component';
import { PageShellComponent } from '../page-shell/page-shell.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

import { EmployeeFormValue } from '../../models/employee-form.model';
import { Employee } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-component',
  standalone: true,
  imports: [
    EmployeeTableComponent,
    EmployeeFormModalComponent,
    DeleteConfirmationModalComponent,
    ToolbarComponent,
    PageShellComponent,
  ],
  templateUrl: './employee-component.component.html',
  styleUrl: './employee-component.component.css',
})
export class EmployeeComponent {
  public title = 'Employee Management System';

  private readonly employeeService = inject(EmployeeService);

  public readonly searchTerm = signal('');

  public readonly sortDirection = signal<'asc' | 'desc'>('asc');

  public readonly sortField = signal<'employeeId' | 'employeeAge'>('employeeId');

  public readonly employees = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const sortField = this.sortField();
    const sortDirection = this.sortDirection();

    const filtered = this.employeeService.employees().filter((employee) => {
      if (!query) {
        return true;
      }

      return (
        employee.employeeName.toLowerCase().includes(query) ||
        employee.employeeId.toString().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      const left = a[sortField];
      const right = b[sortField];

      if (left < right) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      if (left > right) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });
  });

  public isModalOpen = false;

  public isDeleteModalOpen = false;

  public isEditing = false;

  public editingEmployeeId: number | null = null;

  public employeeToDeleteId: number | null = null;

  public form: EmployeeFormValue = {
    employeeId: '',
    employeeName: '',
    employeeAge: '',
    employeeDepartment: '',
    employeeRole: '',
  };

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public get canAdd(): boolean {
    return this.authService.hasPermission('add');
  }

  public get canEdit(): boolean {
    return this.authService.hasPermission('edit');
  }

  public get canDelete(): boolean {
    return this.authService.hasPermission('delete');
  }

  public onSearch(value: string | Event): void {
    const nextValue =
      typeof value === 'string'
        ? value
        : (value.target as HTMLInputElement).value;

    this.searchTerm.set(nextValue);
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public sortBy(field: 'employeeId' | 'employeeAge'): void {
    if (this.sortField() === field) {
      this.sortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortField.set(field);
    this.sortDirection.set('asc');
  }

  public openAddModal(): void {
    if (!this.canAdd) {
      return;
    }

    this.isEditing = false;
    this.editingEmployeeId = null;

    this.form = {
      employeeId: '',
      employeeName: '',
      employeeAge: '',
      employeeDepartment: '',
      employeeRole: '',
    };

    this.isModalOpen = true;
  }

  public openEditModal(employee: Employee): void {
    if (!this.canEdit) {
      return;
    }

    this.isEditing = true;
    this.editingEmployeeId = employee.employeeId;

    this.form = {
      employeeId: String(employee.employeeId),
      employeeName: employee.employeeName,
      employeeAge: String(employee.employeeAge),
      employeeDepartment: employee.employeeDepartment,
      employeeRole: String(employee.employeeRole),
    };

    this.isModalOpen = true;
  }

  public closeModal(): void {
    this.isModalOpen = false;
    this.isEditing = false;
    this.editingEmployeeId = null;

    this.form = {
      employeeId: '',
      employeeName: '',
      employeeAge: '',
      employeeDepartment: '',
      employeeRole: '',
    };
  }

  public openDeleteModal(employeeId: number): void {
    if (!this.canDelete) {
      return;
    }

    this.employeeToDeleteId = employeeId;
    this.isDeleteModalOpen = true;
  }

  public closeDeleteModal(): void {
    this.employeeToDeleteId = null;
    this.isDeleteModalOpen = false;
  }

  public confirmDelete(): void {
    if (!this.canDelete || this.employeeToDeleteId === null) {
      return;
    }

    this.employeeService.deleteEmployee(this.employeeToDeleteId);
    this.closeDeleteModal();
  }

  public saveEmployee(formData: EmployeeFormValue): void {
    if (this.isEditing ? !this.canEdit : !this.canAdd) {
      return;
    }

    const employeeId = Number(formData.employeeId);
    const employeeAge = Number(formData.employeeAge);

    const alreadyExists = this.employeeService
      .getEmployees()
      .some((employee) => {
        if (!this.isEditing) {
          return employee.employeeId === employeeId;
        }

        return (
          employee.employeeId === employeeId &&
          employee.employeeId !== this.editingEmployeeId
        );
      });

    if (alreadyExists) {
      alert('An employee with this ID already exists.');
      return;
    }

    const employee: Employee = {
      employeeId,
      employeeName: formData.employeeName.trim(),
      employeeAge,
      employeeDepartment: formData.employeeDepartment.trim(),
      employeeRole: formData.employeeRole.trim(),
    };

    if (this.isEditing && this.editingEmployeeId !== null) {
      this.employeeService.updateEmployee(
        this.editingEmployeeId,
        employee,
      );
    } else {
      this.employeeService.addEmployee(employee);
    }

    this.closeModal();
  }
}
