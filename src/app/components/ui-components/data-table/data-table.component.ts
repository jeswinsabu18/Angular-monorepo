
import {
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { TableColumn } from '../../../models/table-column.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent {
  public readonly rows = input<object[]>([]);
  public readonly columns = input<TableColumn[]>([]);
  public readonly rowKey = input('id');

  public readonly sortField = input('');
  public readonly sortDirection = input<'asc' | 'desc'>('asc');

  public readonly canEdit = input(false);
  public readonly canDelete = input(false);
  public readonly ariaLabel = input('Data table');

  public readonly pageSizeOptions = input<number[]>([
    5,
    10,
    25,
    50,
  ]);

  // Pagination values are provided by the parent component.
  public readonly currentPage = input(1);
  public readonly pageSize = input(5);
  public readonly totalItems = input(0);

  // Events sent to the parent component.
  public readonly pageChanged = output<number>();
  public readonly pageSizeChanged = output<number>();
  public readonly sortChanged = output<string>();
  public readonly editRow = output<object>();
  public readonly deleteRow = output<object>();

  public readonly totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(this.totalItems() / this.pageSize()),
    ),
  );

  public readonly startItem = computed(() =>
    this.totalItems() === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  public readonly endItem = computed(() =>
    Math.min(
      this.currentPage() * this.pageSize(),
      this.totalItems(),
    ),
  );

  // The API already returns a paginated array.
  // Do not apply slice() again in this component.
  public readonly visibleRows = computed(() => this.rows());

  public readonly pageNumbers = computed(() => {
    const maxVisiblePages = 5;
    const halfWindow = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(
      1,
      this.currentPage() - halfWindow,
    );

    let endPage = Math.min(
      this.totalPages(),
      startPage + maxVisiblePages - 1,
    );

    startPage = Math.max(
      1,
      endPage - maxVisiblePages + 1,
    );

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  });

  public changePage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages() ||
      page === this.currentPage()
    ) {
      return;
    }

    this.pageChanged.emit(page);
  }

  public onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newPageSize = Number(select.value);

    if (!this.pageSizeOptions().includes(newPageSize)) {
      return;
    }

    this.pageSizeChanged.emit(newPageSize);
  }

  public getCellValue(
    row: object,
    key: string,
  ): unknown {
    return (
      (row as Record<string, unknown>)[key] ?? '—'
    );
  }

  public getRowKey(row: object): string | number {
    const value = this.getCellValue(
      row,
      this.rowKey(),
    );

    return typeof value === 'string' ||
      typeof value === 'number'
      ? value
      : JSON.stringify(row);
  }

  public requestSort(column: TableColumn): void {
    if (column.sortable) {
      this.sortChanged.emit(column.key);
    }
  }
}
