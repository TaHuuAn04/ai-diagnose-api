import { ApiProperty } from '@nestjs/swagger';

import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ModelRequestDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'chatbot' })
    type: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'chatbot v2' })
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    keyModel: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'https://www.overleaf.com/project/68b9a39ed5b4afa100bda7fa#subsubsection.5.1.2' })
    modelUrl: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '{ key: asdba; value: 1212; }' })
    modelConfig: JSON

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    accessToken: string
}
