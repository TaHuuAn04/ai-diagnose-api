import { Expose } from 'class-transformer';

export class BaseEntityWithoutId {
  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  @Expose()
  deletedAt?: Date;
}

export class BaseEntity extends BaseEntityWithoutId {
  @Expose()
  id: string;
}