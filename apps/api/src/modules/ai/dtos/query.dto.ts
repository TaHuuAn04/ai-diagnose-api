import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose, Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ChatQueryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'What day is it today?' })
    query: string;
}

@Exclude()
export class ChatResponseDto {
    @Expose()
    @ApiProperty({ example: 'Keep track of your examination schedule' })
    title: string;

    @Expose()
    @ApiProperty({ example: 'What day is it today?' })
    query: string;
   
    @Expose()
    @ApiProperty({ example: 'Today is Thursday' })
    response: string

    @Expose()
    @Type(() => Date)
    @ApiProperty({
      type: String,
      format: 'date-time',
      example: '2025-11-13T14:30:00.000Z',
    })
    datetime: Date
}

@Exclude()
export class ChatResponseListInfo{
    @Expose()
    @ApiProperty({ type: ChatResponseDto, isArray: true })
    messages: ChatResponseDto[]

    @Expose()
    @ApiProperty({ example: 10 })
    totalMessages: number
}