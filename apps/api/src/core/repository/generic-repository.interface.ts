import { PageOptionsDto } from '@app/core/dtos';

export type SortOrder = 'ASC' | 'DESC' | 'asc' | 'desc'


export type WhereCondition<T = Record<string, unknown>> = {

  // Logical operators
  and?: WhereCondition<T>[]
  or?: WhereCondition<T>[]
  not?: WhereCondition<T>

  // Field conditions with better typing
} & {
  [K in keyof T]?: FieldOperators<T[K]> | T[K] | WhereCondition<T>
}

export interface FieldOperators<T> {

  // Comparison operators
  eq?: T
  neq?: T
  gt?: T
  gte?: T
  lt?: T
  lte?: T

  // String operators (only for string types)
  contains?: string
  startsWith?: string
  endsWith?: string
  icontains?: string
  regex?: string

  // Array operators
  in?: T[]
  notIn?: T[]

  // Range operators
  between?: [T, T]

  // Null checks
  isNull?: boolean
  isNotNull?: boolean

  // JSON operators (for JSON fields)
  jsonContains?: Record<string, unknown>
  jsonHasKey?: string | string[]
  jsonExtract?: string // JSON path

  // Array operators (for array fields)
  arrayContains?: T extends (infer U)[] ? U : never
  arrayLength?: number
}


export interface PaginationOptions {
  page?: number
  limit?: number
  offset?: number
}

export interface SortOptions<T> {
  sortBy?: keyof T | string
  sortOrder?: SortOrder
}

export interface RelationOptions {
  relation: string
  select?: string[]
  where?: WhereCondition<unknown>
}

export type CreateInput<T> = Partial<T>
export type UpdateInput<T> = Partial<T>

export interface RepositoryResult<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasNext?: boolean
    hasPrev?: boolean
  }
}

export interface SelectOptions<T> {
  fields: (keyof T | string)[]
  exclude?: (keyof T | string)[]
}

export interface QueryOptions<T = Record<string, unknown>> {

  // Pagination
  pagination?: PaginationOptions

  // Sorting - support multiple sort fields
  sort?: SortOptions<T> | SortOptions<T>[]

  // Filtering
  where?: WhereCondition<T>

  // Relation loading with nested relations support
  relations?: string[] | RelationOptions[]

  // Select specific fields with nested selection
  select?: (keyof T | string)[] | SelectOptions<T>

  // Group by with having clause
  groupBy?: {
    fields: (keyof T | string)[]
    having?: WhereCondition<T>
  }


  /*
   * Caching options
   * cache?: {
   *   key?: string
   *   ttl?: number // in seconds
   * }
   */

  /*
   * Transaction support
   * transaction?: unknown // Database-specific transaction type
   */

  /*
   * Raw query options
   * raw?: Record<string, unknown>
   */
}

export interface IGenericRepository<DomainEntity> {
  findAll(
    options?: QueryOptions<DomainEntity>
  ): Promise<RepositoryResult<DomainEntity[]>>;

  find(
    condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
    pageOptions?: PageOptionsDto,
  ): Promise<DomainEntity[]>;

  count(
    condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
  ): Promise<number>;

  findOne(
    condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
  ): Promise<DomainEntity | null>;

  create(entity: Partial<DomainEntity>): Promise<DomainEntity>;

  update(id: string, entity: Partial<DomainEntity>): Promise<DomainEntity>;

  delete(id: string): Promise<void>;

  softDelete(id: string): Promise<void>;

  updateMany(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conditions: Record<string, any>,
    data: Partial<DomainEntity>,
  ): Promise<boolean>;
}
