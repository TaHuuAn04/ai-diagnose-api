export class PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore?: boolean;
}
