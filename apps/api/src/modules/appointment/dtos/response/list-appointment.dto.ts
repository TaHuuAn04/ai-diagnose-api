import { ApiProperty } from "@nestjs/swagger";

import { Exclude, Expose } from "class-transformer";

import { AppointmentStatus } from "@app/core/domain/enums";
import { ImageInfoDto } from "@app/core/dtos";

@Exclude()
export class GetAppointmentResponseDto {
	@Expose()
	@ApiProperty({ example: 'e9c8a957-5111-427a-af72-78e8bfc8f3dd' })
	id: string;

	@Expose()
	@ApiProperty({ example: 'Dr. John Doe' })
	doctorName: string;

	@Expose()
	@ApiProperty({ example: 'Cardiology' })
	department: string;

	@Expose()
	@ApiProperty({ example: '2024-07-15' })
	date: string;

	@Expose()
	@ApiProperty({ example: '09:00' })
	from: string;	

	@Expose()
	@ApiProperty({ example: '10:00' })
	to: string;

	@Expose()
	@ApiProperty({ example: 'Room 101' })
	room: string;

	@Expose()
	@ApiProperty({ example: AppointmentStatus.SCHEDULED })
	status: AppointmentStatus;

	@Expose()
	@ApiProperty({ example: 'Regular check-up appointment' })
	description?: string | null;

	@Expose()
	@ApiProperty({ example: [{ base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', order: 1 }] })
	images?: ImageInfoDto[] | [];
}
