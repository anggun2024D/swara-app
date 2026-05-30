export * from './auth';
export * from './report';
export * from './user';
export * from './notification';
export * from './analytics';
export * from './category';

// Generic API response wrapper
export interface APIResponse<T = unknown> {
  status: string;
  message: string;
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}