import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

class AIInfoDto {
    @Expose()
    @ApiProperty({ example: 'v1' })
    version: string
  
    @Expose()
    @ApiProperty({ example: 'chatbot v1' })
    name: string

    @Expose()
    @Type(() => Date)
    @ApiProperty({
      type: String,
      format: 'date-time',
      example: '2025-11-13T14:30:00.000Z',
    })
    createdAt: Date

    @Expose()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    keyModel: string

    @Expose()
    @ApiProperty({ example: 'https://www.overleaf.com/project/68b9a39ed5b4afa100bda7fa#subsubsection.5.1.2' })
    modelUrl: string

    @Expose()
    @ApiProperty({ example: '{ key: asdba; value: 1212; }' })
    modelConfig: JSON

    @Expose()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    accessToken: string
}

export class AIListDto {
      @Expose()
      @ApiProperty({ type: AIInfoDto, isArray: true })
      aiList: AIInfoDto[]
  
      @Expose()
      @ApiProperty({ example: 100 })
      totalRecords: number
  
      @Expose()
      @ApiProperty({ example: 1 })
      currentPage: number
  
      @Expose()
      @ApiProperty({ example: 10 })
      pageSize: number
  
      @Expose()
      @ApiProperty({ example: 10 })
      totalPages: number
}