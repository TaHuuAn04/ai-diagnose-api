import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";

export class GetConsultingRoomDto {
  @ApiProperty({ type: String, example: 'doctor123' }) 
  @IsNotEmpty()
  @IsString()
  doctorId: string;
  
  @ApiProperty({ type: String, example: '2023-10-15' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ type: String, example: '09:00' })
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty({ type: String, example: '10:00' })
  @IsNotEmpty()
  @IsString()
  to: string;
}