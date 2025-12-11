import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetListDoctorResponseDto {
  @Expose()
  userId: string;

  @Expose()
  doctorCode: string;

  @Expose()
  department: string;

  @Expose()
  experience?: string | null;

  @Expose()
  description?: string | null;

  @Expose()
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  } | null;
}
