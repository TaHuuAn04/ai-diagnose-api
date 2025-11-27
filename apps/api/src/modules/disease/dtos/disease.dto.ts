import { ApiProperty } from '@nestjs/swagger';

import { ATTACHMENT_MAX_FILE_SIZE } from '@api/constants';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class UpdateDiseaseDto {
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    @MaxFileSize(ATTACHMENT_MAX_FILE_SIZE)
    @IsNotEmpty()
    @ApiProperty({ type: 'string', format: 'binary', isArray: true })
    images: MemoryStoredFile[]
    
    @IsString()
    @IsOptional()
    @ApiProperty({ type: 'string', example: 'on right hand'})
    imageDescriptions?: string[]
}

export class DiseaseRequestDto extends UpdateDiseaseDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Eczema' })
    name: string

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Causes itchy, red, and inflamed skin' })
    description: string
}

class DataInstance {
    @Expose()
    @ApiProperty({ example: 'Nitro_Wallpaper_01_3840x2400.jpg' })
    imageUrl: string

    @Expose()
    @ApiProperty({ example: 'On right hand' })
    description: string
}

@Exclude()
export class DiseaseInfoDto {
    @Expose()
    @ApiProperty({ example: 'Eczema' })
    name: string

    @Expose()
    @ApiProperty({ example: 'Causes itchy, red, and inflamed skin' })
    description: string

    @Expose()
    @Type(() => DataInstance)
    @ApiProperty({ type: DataInstance, isArray: true })
    images: DataInstance[]
}
