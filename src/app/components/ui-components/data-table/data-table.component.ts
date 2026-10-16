
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TableColumn } from '../../../models/table-column.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent {
  @Input() public rows: object[] = [];

  @Input() public columns: TableColumn[] = [];

  @Input() public rowKey = 'id';

  @Input() public sortField = '';

  @Input() public sortDirection: 'asc' | 'desc' = 'asc';

  @Input() public canEdit = false;

  @Input() public canDelete = false;

  @Input() public ariaLabel = 'Data table';

  @Output() public sortChanged = new EventEmitter<string>();

  @Output() public editRow = new EventEmitter<object>();

  @Output() public deleteRow = new EventEmitter<object>();

  public getCellValue(row: object, key: string): unknown {
    const value = (row as Record<string, unknown>)[key];

    return value ?? '—';
  }

  public getRowKey(row: object): string | number {
    const value = this.getCellValue(row, this.rowKey);

    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    return JSON.stringify(row);
  }

  public requestSort(column: TableColumn): void {
    if (column.sortable) {
      this.sortChanged.emit(column.key);
    }
  }
}
