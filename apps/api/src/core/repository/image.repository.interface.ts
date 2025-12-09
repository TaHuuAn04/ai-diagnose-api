/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ImageEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IImageRepository extends IGenericRepository<ImageEntity> {}
