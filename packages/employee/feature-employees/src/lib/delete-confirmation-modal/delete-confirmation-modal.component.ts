import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.css',
})
export class DeleteConfirmationModalComponent {
  @Input() public visible = false;
  @Input() public message =
    'Are you sure you want to delete this employee? This action cannot be undone.';

  @Output() public close = new EventEmitter<void>();
  @Output() public confirm = new EventEmitter<void>();
}
