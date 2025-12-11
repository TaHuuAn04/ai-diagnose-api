import { Expose } from 'class-transformer';

export class BaseEntityWithoutId {
  @Expose()
  createdAt?: Date | null;

  @Expose()
  updatedAt?: Date | null;

  @Expose()
  deletedAt?: Date | null;
}

export class BaseEntity extends BaseEntityWithoutId {
  @Expose()
  id: string;
}