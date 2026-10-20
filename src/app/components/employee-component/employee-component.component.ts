
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { EmployeeFormModalComponent } from '../ui-components/employee-form-modal/employee-form-modal.component';
import { DataTableComponent } from '../ui-components/data-table/data-table.component';
import { PageShellComponent } from '../page-shell/page-shell.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

import { EmployeeFormValue } from '../../models/employee-form.model';
import { Employee } from '../../models/employee.model';
import { TableColumn } from '../../models/table-column.model';

import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import {
  EmployeeSortField,
  MockEmployeeApiService,
} from '../../services/mock-employee-api.service';

@Component({
  selector: 'app-employee-component',
  standalone: true,
  imports: [
    DataTableComponent,
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
  private readonly authService = inject(AuthService);
  private readonly mockEmployeeApi = inject(MockEmployeeApiService);
  private readonly router = inject(Router);

  public readonly employeeColumns: TableColumn[] = [
    { key: 'employeeId', label: 'ID', sortable: true },
    { key: 'employeeName', label: 'Name', sortable: true },
    { key: 'employeeAge', label: 'Age', sortable: true },
    { key: 'employeeDepartment', label: 'Department' },
    { key: 'employeeRole', label: 'Role' },
  ];

  public readonly searchTerm = signal('');

  public readonly sortDirection = signal<'asc' | 'desc'>('asc');

  public readonly sortField = signal<EmployeeSortField>(
    'employeeId',
  );

  // These rows contain only the current page's employees.
  public readonly pageRows = signal<Employee[]>([]);

  public readonly currentPage = signal(1);
  public readonly pageSize = signal(5);
  public readonly totalItems = signal(0);

  public readonly isLoading = signal(false);
  public readonly loadError = signal('');

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

  public constructor() {
    this.loadEmployeesPage();
  }

  public get canAdd(): boolean {
    return this.authService.hasPermission('add');
  }

  public get canEdit(): boolean {
    return this.authService.hasPermission('edit');
  }

  public get canDelete(): boolean {
    return this.authService.hasPermission('delete');
  }

  public loadEmployeesPage(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.mockEmployeeApi
      .getEmployeesPage({
        page: this.currentPage(),
        pageSize: this.pageSize(),
        search: this.searchTerm(),
        sortField: this.sortField(),
        sortDirection: this.sortDirection(),
      })
      .subscribe({
        next: (response) => {
          this.pageRows.set(response.data);
          this.totalItems.set(response.totalItems);
          this.currentPage.set(response.page);
          this.isLoading.set(false);
        },

        error: (error: unknown) => {
          console.error(
            'Failed to load employees page:',
            error,
          );

          this.pageRows.set([]);
          this.totalItems.set(0);
          this.loadError.set(
            'Unable to load employees. Please try again.',
          );
          this.isLoading.set(false);
        },
      });
  }

  public onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadEmployeesPage();
  }

  public onPageSizeChanged(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadEmployeesPage();
  }

  public onSearch(value: string | Event): void {
    const nextValue =
      typeof value === 'string'
        ? value
        : (value.target as HTMLInputElement).value;

    this.searchTerm.set(nextValue);
    this.currentPage.set(1);
    this.loadEmployeesPage();
  }

  public sortBy(field: string): void {
    if (
      field !== 'employeeId' &&
      field !== 'employeeName' &&
      field !== 'employeeAge'
    ) {
      return;
    }

    if (this.sortField() === field) {
      this.sortDirection.update((direction) =>
        direction === 'asc' ? 'desc' : 'asc',
      );
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }

    this.currentPage.set(1);
    this.loadEmployeesPage();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public onEditRow(row: object): void {
    this.openEditModal(row as Employee);
  }

  public onDeleteRow(row: object): void {
    const employee = row as Employee;
    this.openDeleteModal(employee.employeeId);
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
    if (
      !this.canDelete ||
      this.employeeToDeleteId === null
    ) {
      return;
    }

    this.employeeService.deleteEmployee(
      this.employeeToDeleteId,
    );

    this.closeDeleteModal();

    // Reload in case the current page has fewer records now.
    this.loadEmployeesPage();
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

    if (
      this.isEditing &&
      this.editingEmployeeId !== null
    ) {
      this.employeeService.updateEmployee(
        this.editingEmployeeId,
        employee,
      );
    } else {
      this.employeeService.addEmployee(employee);
    }

    this.closeModal();
    this.loadEmployeesPage();
  }
}
