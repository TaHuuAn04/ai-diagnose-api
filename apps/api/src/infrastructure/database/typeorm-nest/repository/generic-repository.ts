import {
  CreateInput,
  FieldOperators,
  IGenericRepository,
  QueryOptions,
  RelationOptions,
  RepositoryResult,
  SortOrder,
  UpdateInput,
  WhereCondition
} from '@api/core/repository'
import {
  Between,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  ObjectLiteral,
  Raw,
  Repository
} from 'typeorm'

export abstract class GenericRepository<
  TDomainEntity,
  TTypeOrmEntity extends ObjectLiteral
> implements IGenericRepository<TDomainEntity> {
  constructor(
    protected readonly _repository: Repository<TTypeOrmEntity>,
    protected readonly _mapper: {
      toDomain: (entity: TTypeOrmEntity) => TDomainEntity
      toOrmEntity: (entity: TDomainEntity) => TTypeOrmEntity
    }
  ) {}

  async findAll(
    options?: QueryOptions<TDomainEntity>
  ): Promise<RepositoryResult<TDomainEntity[]>> {
    const typeormOptions = this._buildTypeOrmOptions(options)

    // Get total count for pagination metadata
    const total = options?.pagination
      ? await this._repository.count({ where: typeormOptions.where as FindOptionsWhere<TTypeOrmEntity> })
      : undefined

    const entities = await this._repository.find(typeormOptions)
    const data = entities.map(entity => this._mapper.toDomain(entity))

    // Build pagination metadata
    const meta = options?.pagination
      ? this._buildPaginationMeta(total, options.pagination)
      : undefined

    return { data, meta: meta as { total?: number, page?: number, limit?: number, hasNext?: boolean, hasPrev?: boolean } }
  }

  async find(
    condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>,
    pageOptions?: { take?: number; skip?: number }
  ): Promise<TDomainEntity[]> {
    const entities = await this._repository.find({
      where: condition as FindOptionsWhere<TTypeOrmEntity>,
      take: pageOptions?.take,
      skip: pageOptions?.skip
    })

    return entities.map(entity => this._mapper.toDomain(entity))
  }

  async findById(
    id: string,
    options?: Pick<QueryOptions<TDomainEntity>, 'relations' | 'select'>
  ): Promise<TDomainEntity | null> {
    const typeormOptions = this._buildTypeOrmOptions(options) as FindOneOptions<TTypeOrmEntity>

    typeormOptions.where = { id: id as unknown } as FindOptionsWhere<TTypeOrmEntity>

    const entity = await this._repository.findOne(typeormOptions)

    return entity ? this._mapper.toDomain(entity) : null
  }

  async findOne(
    condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>
  ): Promise<TDomainEntity | null> {
    const entity = await this._repository.findOne({
      where: condition as FindOptionsWhere<TTypeOrmEntity>
    })

    return entity ? this._mapper.toDomain(entity) : null
  }

  async findOneWithOptions(
    options: QueryOptions<TDomainEntity>
  ): Promise<TDomainEntity | null> {
    const typeormOptions = this._buildTypeOrmOptions(options)
    const entity = await this._repository.findOne(typeormOptions as FindOneOptions<TTypeOrmEntity>)

    return entity ? this._mapper.toDomain(entity) : null
  }

  async findByIds(
    ids: string[],
    options?: QueryOptions<TDomainEntity>
  ): Promise<TDomainEntity[]> {
    if (ids.length === 0) {
      return []
    }

    const typeormOptions = this._buildTypeOrmOptions(options)

    // Add the ids to the where condition
    const idCondition = { id: In(ids) as unknown } as FindOptionsWhere<TTypeOrmEntity>

    if (typeormOptions.where) {
      if (Array.isArray(typeormOptions.where)) {
        typeormOptions.where = typeormOptions.where.map(where => ({ ...where, ...idCondition }))
      }
      else {
        typeormOptions.where = { ...typeormOptions.where, ...idCondition }
      }
    }
    else {
      typeormOptions.where = idCondition
    }

    const entities = await this._repository.find(typeormOptions)

    return entities.map(entity => this._mapper.toDomain(entity))
  }

  async count(
    condition: Partial<{ [K in keyof TDomainEntity]: TDomainEntity[K] }>
  ): Promise<number> {
    return await this._repository.count({
      where: condition as FindOptionsWhere<TTypeOrmEntity>
    })
  }

  async countWithOptions(
    options?: WhereCondition<TDomainEntity>
  ): Promise<number> {
    const typeormOptions = this._buildTypeOrmOptions({ where: options } as QueryOptions<TDomainEntity>)

    return await this._repository.count(typeormOptions)
  }

  async exists(
    options: WhereCondition<TDomainEntity>
  ): Promise<boolean> {
    const count = await this.countWithOptions(options)

    return count > 0
  }

  async create(
    entity: CreateInput<TDomainEntity>
  ): Promise<TDomainEntity> {
    const ormEntity = this._mapper.toOrmEntity(entity as TDomainEntity)
    const savedEntity = await this._repository.save(ormEntity)

    return this._mapper.toDomain(savedEntity)
  }

  async createMany(
    entities: CreateInput<TDomainEntity>[]
  ): Promise<TDomainEntity[]> {
    if (entities.length === 0) {
      return []
    }

    const ormEntities = entities.map(entity => this._mapper.toOrmEntity(entity as TDomainEntity))
    const savedEntities = await this._repository.save(ormEntities)

    return savedEntities.map(entity => this._mapper.toDomain(entity))
  }

  async update(
    id: string,
    entity: UpdateInput<TDomainEntity>
  ): Promise<TDomainEntity> {
    const ormEntity = this._mapper.toOrmEntity({ ...entity, id } as TDomainEntity)
    const savedEntity = await this._repository.save(ormEntity)

    return this._mapper.toDomain(savedEntity)
  }

  async delete(id: string): Promise<void> {
    await this._repository.delete(id)
  }

  async softDelete(id: string): Promise<void> {
    await this._repository.softDelete(id)
  }

  async updateMany(
    conditions: Record<string, unknown>,
    data: Partial<TDomainEntity>
  ): Promise<boolean> {
    const result = await this._repository.update(
      conditions as FindOptionsWhere<TTypeOrmEntity>,
      data as unknown as TTypeOrmEntity
    )

    return !!(result.affected && result.affected > 0)
  }

  async deleteMany(
    where: WhereCondition<TDomainEntity>
  ): Promise<number> {
    const whereCondition = this._buildWhereCondition(where)
    const deleteResult = await this._repository.delete(whereCondition)

    return deleteResult.affected ?? 0
  }

  // Helper methods to convert query options to TypeORM options
  private _buildTypeOrmOptions(
    options?: QueryOptions<TDomainEntity>
  ): FindManyOptions<TTypeOrmEntity> {
    if (!options) return {}

    const typeormOptions: Partial<FindManyOptions<TTypeOrmEntity>> = {}

    // Handle pagination
    if (options.pagination) {
      if (options.pagination.page !== undefined && options.pagination.limit !== undefined) {
        typeormOptions.skip = (options.pagination.page - 1) * options.pagination.limit
        typeormOptions.take = options.pagination.limit
      }
      else if (options.pagination.offset !== undefined && options.pagination.limit !== undefined) {
        typeormOptions.skip = options.pagination.offset
        typeormOptions.take = options.pagination.limit
      }
      else if (options.pagination.limit !== undefined) {
        typeormOptions.take = options.pagination.limit
      }
    }

    // Handle sorting (support for multiple sort fields)
    if (options.sort) {
      if (Array.isArray(options.sort)) {
        const orderObj: Record<string, SortOrder> = {}

        options.sort.forEach((sortOption) => {
          if (sortOption.sortBy) {
            orderObj[sortOption.sortBy as string] = sortOption.sortOrder ?? 'ASC'
          }
        })
        typeormOptions.order = orderObj as FindOptionsOrder<TTypeOrmEntity>
      }
      else if (options.sort.sortBy) {
        typeormOptions.order = { [options.sort.sortBy as string]: options.sort.sortOrder ?? 'ASC' } as FindOptionsOrder<TTypeOrmEntity>
      }
    }

    // Handle relations with enhanced options
    if (options.relations) {
      if (Array.isArray(options.relations) && typeof options.relations[0] === 'string') {
        // Simple string array relations
        typeormOptions.relations = options.relations as unknown as FindOptionsRelations<TTypeOrmEntity>
      }
      else if (Array.isArray(options.relations)) {
        // Enhanced relation options - Fixed syntax error
        const relationsObj: Record<string, boolean | { select?: string[] }> = {}

          ;(options.relations as RelationOptions[]).forEach((relationOption) => {
          if (relationOption.select && relationOption.select.length > 0) {
            relationsObj[relationOption.relation] = { select: relationOption.select }
          }
          else {
            relationsObj[relationOption.relation] = true
          }

          // TODO: Handle nested where conditions for relations
        })

        typeormOptions.relations = relationsObj as unknown as FindOptionsRelations<TTypeOrmEntity>
      }
    }

    // Handle select fields with enhanced options
    if (options.select) {
      if (Array.isArray(options.select)) {
        // Simple array of fields
        typeormOptions.select = options.select as unknown as FindOptionsSelect<TTypeOrmEntity>
      }
      else {
        // Enhanced select options
        const selectObj: Record<string, boolean> = {}

        // Include fields
        options.select.fields.forEach((field) => {
          selectObj[field as string] = true
        })

        // Exclude fields - Note: TypeORM doesn't support exclude, we need to manually handle this
        if (options.select.exclude && options.select.exclude.length > 0) {
          /*
           * For exclude to work properly, we'd need to get all entity fields and subtract the excluded ones
           * This is a simplified approach - in practice you might want to use QueryBuilder for this
           */
          console.warn('Select exclude is not fully supported with TypeORM find options. Consider using QueryBuilder.')
        }

        typeormOptions.select = selectObj as unknown as FindOptionsSelect<TTypeOrmEntity>
      }
    }

    // Handle where conditions
    if (options.where) {
      typeormOptions.where = this._buildWhereCondition(options.where)
    }

    // Handle group by with having - Note: This requires QueryBuilder for proper implementation
    if (options.groupBy) {
      console.warn('GroupBy with having is not fully supported with TypeORM find options. Use QueryBuilder for advanced grouping.')

      // For basic grouping without having clause, you could use raw queries or QueryBuilder
    }

    return typeormOptions as FindManyOptions<TTypeOrmEntity>
  }

  private _buildWhereCondition(
    whereCondition: WhereCondition<TDomainEntity>
  ): FindOptionsWhere<TTypeOrmEntity> | FindOptionsWhere<TTypeOrmEntity>[] {
    // Handle logical operators first
    if (whereCondition.and && whereCondition.and.length > 0) {
      // For AND, we combine all conditions into a single object
      const andConditions = whereCondition.and.map(condition => this._buildWhereCondition(condition))

      return this._combineAndConditions(andConditions as FindOptionsWhere<TTypeOrmEntity>[])
    }

    if (whereCondition.or && whereCondition.or.length > 0) {
      // For OR, we return an array of conditions
      return whereCondition.or.map(condition => this._buildWhereCondition(condition)).flat() as FindOptionsWhere<TTypeOrmEntity>[]
    }

    if (whereCondition.not) {
      return Not(
        this._buildWhereCondition(whereCondition.not)
      ) as FindOptionsWhere<TTypeOrmEntity>
    }

    // Process field conditions
    const result: Record<string, unknown> = {}

    Object.entries(whereCondition as Record<string, unknown>).forEach(([key, value]) => {
      if (['and', 'or', 'not'].includes(key)) {
        return
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        // Handle field operators
        if (this._isFieldOperator(value)) {
          result[key] = this._buildFieldOperators(value as FieldOperators<unknown>)
        }
        else {
          // Handle nested where condition
          result[key] = this._buildWhereCondition(value as WhereCondition<unknown>)
        }
      }
      else {
        // Handle direct value comparison (equals)
        result[key] = value
      }
    })

    return result as FindOptionsWhere<TTypeOrmEntity>
  }

  private _isFieldOperator(value: unknown): boolean {
    if (!value || typeof value !== 'object') {
      return false
    }

    const operatorKeys = [
      'eq',
      'neq',
      'gt',
      'gte',
      'lt',
      'lte',
      'in',
      'notIn',
      'between',
      'isNull',
      'isNotNull',
      'jsonContains',
      'jsonHasKey',
      'jsonExtract',
      'arrayContains',
      'arrayLength',
      'contains',
      'startsWith',
      'endsWith',
      'icontains',
      'regex'
    ]

    return Object.keys(value as Record<string, unknown>)
      .some(key => operatorKeys.includes(key))
  }

  private _buildFieldOperators(operators: FieldOperators<unknown>): unknown {
    /*
     * Handle multiple operators - return the first one found
     * In a more sophisticated implementation, you might want to combine them
     */

    // Equality operators
    if (operators.eq !== undefined) {
      return operators.eq
    }

    if (operators.neq !== undefined) {
      return Not(operators.neq)
    }

    // Comparison operators - Fixed to use proper TypeORM operators
    if (operators.gt !== undefined) {
      return MoreThan(operators.gt)
    }

    if (operators.gte !== undefined) {
      return MoreThanOrEqual(operators.gte)
    }

    if (operators.lt !== undefined) {
      return LessThan(operators.lt)
    }

    if (operators.lte !== undefined) {
      return LessThanOrEqual(operators.lte)
    }

    // Array operators
    if (operators.in !== undefined) {
      return In(operators.in as unknown as unknown[])
    }

    if (operators.notIn !== undefined) {
      return Not(In(operators.notIn as unknown as unknown[]))
    }

    // Range operators
    if (operators.between !== undefined && Array.isArray(operators.between)) {
      return Between(operators.between[0], operators.between[1])
    }

    // Null checks
    if (operators.isNull !== undefined) {
      return operators.isNull ? IsNull() : Not(IsNull())
    }

    if (operators.isNotNull !== undefined) {
      return operators.isNotNull ? Not(IsNull()) : IsNull()
    }

    // String operators - Added support for string operations
    if (operators.contains !== undefined) {
      return Like(`%${operators.contains}%`)
    }

    if (operators.startsWith !== undefined) {
      return Like(`${operators.startsWith}%`)
    }

    if (operators.endsWith !== undefined) {
      return Like(`%${operators.endsWith}`)
    }

    if (operators.icontains !== undefined) {
      return ILike(`%${operators.icontains}%`)
    }

    if (operators.regex !== undefined) {
      // Database-specific implementation
      return Raw(alias => `${alias} ~ :regex`, { regex: operators.regex })
    }

    // JSON operators - Database-specific implementations
    if (operators.jsonContains !== undefined) {
      // PostgreSQL example
      return Raw(alias => `${alias} @> :jsonValue`, { jsonValue: JSON.stringify(operators.jsonContains) })
    }

    if (operators.jsonHasKey !== undefined) {
      const key = Array.isArray(operators.jsonHasKey) ? operators.jsonHasKey[0] : operators.jsonHasKey

      return Raw(alias => `${alias} ? :key`, { key })
    }

    if (operators.jsonExtract !== undefined) {
      return Raw(alias => `${alias} ->> :path`, { path: operators.jsonExtract })
    }

    // Note: arrayContains and arrayLength are type-specific and may not be available for all field types
    // Uncomment and use carefully when working with array fields
    // if (operators.arrayContains) {
    //   return Raw(alias => `${alias} @> ARRAY[:value]`, { value: operators.arrayContains })
    // }

    if (operators.arrayLength !== undefined) {
      return Raw(alias => `array_length(${alias}, 1) = :length`, { length: operators.arrayLength })
    }

    return {}
  }

  // Helper methods for combining conditions
  private _combineWithAnd(conditions: Record<string, unknown>[]): Record<string, unknown> {
    if (conditions.length === 0) return {}

    if (conditions.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return conditions.at(0)!
    }

    return conditions.reduce<Record<string, unknown>>((result, condition) => {
      return { ...result, ...condition }
    }, {})
  }

  private _combineAndConditions(
    conditions: (FindOptionsWhere<TTypeOrmEntity> | FindOptionsWhere<TTypeOrmEntity>[])[]
  ): FindOptionsWhere<TTypeOrmEntity> {
    const flatConditions: Record<string, unknown>[] = []

    conditions.forEach((condition) => {
      if (Array.isArray(condition)) {
        /*
         * If it's an array (OR conditions), we need to handle it differently
         * This is a complex case - for now, take the first condition
         */
        flatConditions.push(condition[0] as Record<string, unknown>)
      }
      else {
        flatConditions.push(condition as Record<string, unknown>)
      }
    })

    return this._combineWithAnd(flatConditions) as FindOptionsWhere<TTypeOrmEntity>
  }

  // Improved pagination metadata building
  private _buildPaginationMeta(total: number | undefined, pagination: { page?: number, limit?: number, offset?: number }): { total?: number, page?: number, limit?: number, hasNext?: boolean, hasPrev?: boolean, offset?: number } {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta: any = { total }

    if (pagination.page !== undefined && pagination.limit !== undefined) {
      meta.page = pagination.page
      meta.limit = pagination.limit

      if (total !== undefined) {
        meta.hasNext = pagination.page * pagination.limit < total
        meta.hasPrev = pagination.page > 1
      }
    }
    else if (pagination.offset !== undefined && pagination.limit !== undefined) {
      meta.offset = pagination.offset
      meta.limit = pagination.limit

      if (total !== undefined) {
        meta.hasNext = pagination.offset + pagination.limit < total
        meta.hasPrev = pagination.offset > 0
      }
    }

    return meta as { total?: number, page?: number, limit?: number, hasNext?: boolean, hasPrev?: boolean, offset?: number }
  }
}