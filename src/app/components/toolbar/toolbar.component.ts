import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomInputComponent } from '../ui-components/custom-input/custom-input.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [FormsModule, CustomInputComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  @Input()
  public searchTerm = '';

  @Input()
  public canAdd = true;

  @Output()
  public searchChanged = new EventEmitter<string>();

  @Output()
  public addEmployee = new EventEmitter<void>();

  public onSearchChange(value: string): void {
    this.searchChanged.emit(value);
  }

  public clearSearch(): void {
    this.searchChanged.emit('');
  }
}
