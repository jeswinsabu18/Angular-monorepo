import { Component, computed, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,

  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css',
})
export class EmployeeDetailsComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly employeeService = inject(EmployeeService);

  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  public readonly employee = computed(() => {
    const employeeId = this.routeParams().get('id');

    if (employeeId === null) {
      return undefined;
    }

    const id = Number(employeeId);

    return this.employeeService.employees().find((employee) => employee.employeeId === id);
  });
}
