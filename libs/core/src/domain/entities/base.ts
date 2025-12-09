import { Expose } from 'class-transformer';

export class BaseEntity {
  @Expose()
  id: string;

  @Expose()
  createdAt?: Date | null;

  @Expose()
  updatedAt?: Date | null;

  @Expose()
  deletedAt?: Date | null;
}