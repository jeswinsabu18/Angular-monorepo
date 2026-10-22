import { inject, Injectable, signal } from '@angular/core';

import { Employee } from '@employee-management/shared-models';

import { EMPLOYEE_SEED_DATA } from './employee-seed-data.token';

interface LegacyEmployee {
  id: number;
  name: string;
  age: number;
  department: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly seedEmployees = inject(EMPLOYEE_SEED_DATA);

  private readonly storageKey = 'employees';

  private readonly writableEmployees = signal<Employee[]>([]);

  public readonly employees = this.writableEmployees.asReadonly();

  public constructor() {
    this.initializeEmployees();
  }

  public getEmployees(): Employee[] {
    return this.employees();
  }

  public getEmployeeById(employeeId: number): Employee | undefined {
    return this.employees().find((employee) => employee.employeeId === employeeId);
  }

  public addEmployee(employee: Employee): void {
    this.writableEmployees.update((employees) => [...employees, employee]);

    this.persistEmployees();
  }

  public updateEmployee(employeeId: number, updatedEmployee: Employee): void {
    if (this.employees().some((employee) => employee.employeeId === employeeId)) {
      this.writableEmployees.update((employees) =>
        employees.map((employee) =>
          employee.employeeId === employeeId ? updatedEmployee : employee,
        ),
      );

      this.persistEmployees();
    }
  }

  public deleteEmployee(employeeId: number): void {
    this.writableEmployees.update((employees) =>
      employees.filter((employee) => employee.employeeId !== employeeId),
    );

    this.persistEmployees();
  }

  private initializeEmployees(): void {
    const savedEmployees = localStorage.getItem(this.storageKey);

    if (savedEmployees) {
      this.writableEmployees.set(
        (JSON.parse(savedEmployees) as Array<Employee | LegacyEmployee>).map((employee) =>
          this.normalizeEmployee(employee),
        ),
      );

      this.persistEmployees();

      return;
    }

    this.writableEmployees.set([...this.seedEmployees]);

    this.persistEmployees();
  }

  private persistEmployees(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.employees()));
  }

  private normalizeEmployee(employee: Employee | LegacyEmployee): Employee {
    if ('employeeId' in employee) {
      return employee;
    }

    return {
      employeeId: employee.id,

      employeeName: employee.name,

      employeeAge: employee.age,

      employeeDepartment: employee.department,

      employeeRole: employee.role,
    };
  }
}
