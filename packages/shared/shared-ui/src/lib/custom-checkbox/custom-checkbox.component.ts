import { Component, EventEmitter, Input, Output } from '@angular/core';

let nextCheckboxId = 0;

@Component({
  selector: 'app-custom-checkbox',
  standalone: true,
  templateUrl: './custom-checkbox.component.html',
  styleUrl: './custom-checkbox.component.css',
})
export class CustomCheckboxComponent {
  // Current checked state supplied by the parent.
  @Input() public checked = false;

  // Allows the parent to disable the checkbox.
  @Input() public disabled = false;

  // Optional visible label.
  @Input() public label = '';

  // Accessible name for checkboxes without a visible label.
  @Input() public ariaLabel = '';

  // Unique ID for associating a label with the checkbox.
  @Input() public checkboxId = `app-custom-checkbox-${nextCheckboxId++}`;

  // Emits the new checked state when the user changes it.
  @Output() public checkedChange = new EventEmitter<boolean>();

  public onCheckboxChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.checkedChange.emit(input.checked);
  }
}
