import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IImageRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ImageEntity } from '@app/core/domain/entities';

import { Image } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ImageRepository
  extends GenericRepository<Image, ImageEntity>(Image)
  implements IImageRepository
{
  constructor(
    @InjectRepository(Image)
    public readonly repository: Repository<Image>,
  ) {
    const toDomainEntity = (typeOrmEntity: Image): ImageEntity => {
      return plainToInstance(ImageEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
