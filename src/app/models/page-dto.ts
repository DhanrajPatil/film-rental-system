export interface PageDto<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}
