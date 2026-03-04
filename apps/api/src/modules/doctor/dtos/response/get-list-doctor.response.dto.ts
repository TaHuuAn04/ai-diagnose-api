import { Exclude, Expose } from 'class-transformer';

import { UserInfoDto } from '../../../user/dtos';

@Exclude()
export class GetDoctorResponseDto extends UserInfoDto {
  @Expose()
  doctorCode: string;

  @Expose()
  department: string;

  @Expose()
  experience?: string | null;

  @Expose()
  description?: string | null;
}
