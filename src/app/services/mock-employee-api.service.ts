
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Employee } from '../models/employee.model';
import { PagedResponse } from '../models/paged-response.model';

export type EmployeeSortField =
  | 'employeeId'
  | 'employeeName'
  | 'employeeAge';

export interface EmployeePageParams {
  page: number;
  pageSize: number;
  search?: string;
  sortField?: EmployeeSortField;
  sortDirection?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class MockEmployeeApiService {
  private readonly storageKey = 'employees';

  /**
   * Simulates:
   * GET /api/employees?page=1&pageSize=5
   *
   * Data is read from localStorage, not from a real backend.
   */
  public getEmployeesPage(
    params: EmployeePageParams,
  ): Observable<PagedResponse<Employee>> {
    return of(null).pipe(
      delay(300),

      map(() => {
        const storedData = localStorage.getItem(this.storageKey);

        const employees: Employee[] = storedData
          ? (JSON.parse(storedData) as Employee[])
          : [];

        const searchTerm = (params.search ?? '')
          .trim()
          .toLowerCase();

        // Filter employees using the search term.
        const filteredEmployees = employees.filter((employee) => {
          if (!searchTerm) {
            return true;
          }

          return (
            employee.employeeName.toLowerCase().includes(searchTerm) ||
            String(employee.employeeId).includes(searchTerm)
          );
        });

        // Sort without modifying the original array.
        const sortField = params.sortField ?? 'employeeId';
        const sortDirection = params.sortDirection ?? 'asc';

        const sortedEmployees = [...filteredEmployees].sort((a, b) => {
          const left = a[sortField];
          const right = b[sortField];

          let comparison: number;

          if (
            typeof left === 'string' &&
            typeof right === 'string'
          ) {
            comparison = left.localeCompare(right);
          } else {
            comparison = Number(left) - Number(right);
          }

          return sortDirection === 'asc'
            ? comparison
            : -comparison;
        });

        // Calculate pagination metadata.
        const totalItems = sortedEmployees.length;

        const pageSize = Math.max(
          1,
          Math.floor(params.pageSize) || 5,
        );

        const totalPages = Math.ceil(totalItems / pageSize);

        const requestedPage = Math.max(
          1,
          Math.floor(params.page) || 1,
        );

        const page =
          totalPages === 0
            ? 1
            : Math.min(requestedPage, totalPages);

        const startIndex = (page - 1) * pageSize;

        // Return only the records belonging to the requested page.
        const data = sortedEmployees.slice(
          startIndex,
          startIndex + pageSize,
        );

        return {
          data,
          totalItems,
          page,
          pageSize,
          totalPages,
        };
      }),
    );
  }
}
