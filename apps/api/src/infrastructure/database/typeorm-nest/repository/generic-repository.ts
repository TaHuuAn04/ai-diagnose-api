import { NotFoundException, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IGenericRepository } from 'apps/api/src/core/repository';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { PageOptionsDto } from '@app/core/dtos';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<I> = new (...args: any[]) => I;

export function GenericRepository<
  OrmModel extends ObjectLiteral,
  DomainEntity extends ObjectLiteral,
>(entity: Constructor<OrmModel>): Type<IGenericRepository<DomainEntity>> {
  class DataServiceHost implements IGenericRepository<DomainEntity> {
    constructor(
      @InjectRepository(entity)
      public readonly repository: Repository<OrmModel>,

      private readonly toDomainEntity: (
        typeOrmEntity: OrmModel,
      ) => DomainEntity,
    ) {}

    async find(
      condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
      pageOptions?: PageOptionsDto,
    ): Promise<DomainEntity[]> {
      const ormEntities = await this.repository.find({
        where: condition as unknown as FindOptionsWhere<OrmModel>,
        take: pageOptions?.take ?? 100,
        skip: pageOptions?.skip ?? 0,
        order: {
          ...(pageOptions?.sort
            ? { [pageOptions.sort]: pageOptions.sortDirection ?? 'ASC' }
            : {}),
        } as unknown as FindOptionsOrder<OrmModel>,
      });
      return ormEntities.map(this.toDomainEntity);
    }

    async count(
      condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
    ): Promise<number> {
      return await this.repository.count({
        where: condition as unknown as FindOptionsWhere<OrmModel>,
      });
    }

    async findOne(
      condition: Partial<{ [K in keyof DomainEntity]: DomainEntity[K] }>,
    ): Promise<DomainEntity | null> {
      const ormModel = await this.repository.findOne({
        where: condition as unknown as FindOptionsWhere<OrmModel>,
      });

      if (!ormModel) {
        return null;
      }

      return this.toDomainEntity(ormModel);
    }

    async create(entity: Partial<DomainEntity>): Promise<DomainEntity> {
      const ormModel = this.repository.create(
        entity as unknown as DeepPartial<OrmModel>,
      );
      const savedOrmEntity = await this.repository.save(ormModel);
      return this.toDomainEntity(savedOrmEntity);
    }

    async update(
      id: string,
      entity: Partial<DomainEntity>,
    ): Promise<DomainEntity> {
      const condition = { id } as unknown as FindOptionsWhere<OrmModel>;
      const ormModel = await this.repository.findOne({
        where: condition,
      });

      if (!ormModel) {
        throw new NotFoundException(
          `${this.repository.metadata.name} entity with id ${id} not found`,
        );
      }

      const updatedOrmEntity = { ...ormModel, ...entity };
      const savedOrmEntity = await this.repository.save(updatedOrmEntity);
      return this.toDomainEntity(savedOrmEntity);
    }

    async delete(id: string): Promise<void> {
      const condition = { id } as unknown as FindOptionsWhere<OrmModel>;
      const ormModel = await this.repository.findOne({
        where: condition,
      });

      if (!ormModel) {
        throw new NotFoundException(
          `${this.repository.metadata.name} entity with id ${id} not found`,
        );
      }

      await this.repository.delete(condition);
    }

    async softDelete(id: string): Promise<void> {
      const condition = { id } as unknown as FindOptionsWhere<OrmModel>;
      const ormModel = await this.repository.findOne({
        where: condition,
      });

      if (!ormModel) {
        throw new NotFoundException(
          `${this.repository.metadata.name} entity with id ${id} not found`,
        );
      }

      const softDeletedOrmEntity = { ...ormModel, deletedAt: new Date() };
      await this.repository.update(id, softDeletedOrmEntity);
    }

    async updateMany(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      conditions: Record<string, any>,
      data: Partial<DomainEntity>,
    ): Promise<boolean> {
      const result = await this.repository.update(
        conditions,
        data as unknown as QueryDeepPartialEntity<OrmModel>,
      );
      if (!result.affected) {
        return false;
      }
      return result.affected > 0;
    }
  }

  return DataServiceHost;
}
