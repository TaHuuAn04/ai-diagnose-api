export interface CorePaginateResult<T> {
  success?: boolean;
  statusCode: number;
  data?: {
    list?: T[];
    total?: number;
    pages?: number;
    hasNextPage?: boolean;
    encKey?: string;
  } | null;
  message: string;
}

export interface CoreResponse<T> {
  success?: boolean;
  statusCode?: number;
  data?: T;
  message?: string;
  excel?: {
    name: string;
    data: Record<string, unknown>[];
    customHeaders?: string[];
  };
}
