/** Standard response shape returned by the mock paginated API. */
export interface PagedResponse<T> {
  data: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
