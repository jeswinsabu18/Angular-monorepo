import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { EmployeeFormValue } from '@employee-management/shared-models';

import { CustomInputComponent } from '@employee-management/shared-ui';

@Component({
  selector: 'app-employee-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './employee-form-modal.component.html',
  styleUrl: './employee-form-modal.component.css',
})
export class EmployeeFormModalComponent {
  @Input() public visible = false;

  @Input() public isEditing = false;

  @Output() public close = new EventEmitter<void>();

  @Output() public submitForm = new EventEmitter<EmployeeFormValue>();

  private fb = inject(FormBuilder);

  public employeeForm: FormGroup = this.fb.group({
    employeeId: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],

    employeeName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],

    employeeAge: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(18), Validators.max(70)],
    ],

    employeeDepartment: ['', Validators.required],

    employeeRole: ['', Validators.required],
  });

  public errorMessages: { [key: string]: string } = {};

  @Input() public set form(value: EmployeeFormValue) {
    this.employeeForm.patchValue(
      {
        employeeId: value.employeeId,
        employeeName: value.employeeName,
        employeeAge: value.employeeAge,
        employeeDepartment: value.employeeDepartment,
        employeeRole: value.employeeRole,
      },
      {
        emitEvent: false,
      },
    );

    this.employeeForm.markAsPristine();

    this.employeeForm.markAsUntouched();
  }

  public submit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();

      return;
    }

    const formValue = this.employeeForm.getRawValue();

    const employee: EmployeeFormValue = {
      employeeId: String(formValue.employeeId),

      employeeName: String(formValue.employeeName),

      employeeAge: String(formValue.employeeAge),

      employeeDepartment: String(formValue.employeeDepartment),

      employeeRole: String(formValue.employeeRole),
    };

    this.submitForm.emit(employee);
  }
}
