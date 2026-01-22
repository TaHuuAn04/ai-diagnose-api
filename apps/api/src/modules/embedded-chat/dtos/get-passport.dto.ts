import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetEmbeddedChatPassportQueryDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

export class GetPassportInputDto extends GetEmbeddedChatPassportQueryDto {
  xAppCode: string;
}

export class GetPassportResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @Expose()
  access_token: string;
}
