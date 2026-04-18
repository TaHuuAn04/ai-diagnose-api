import { Expose } from "class-transformer";

export class GetStaffInfoResponseDto {
  @Expose()
  name: string;

  @Expose()
  email: string;
    
  @Expose()
  gender: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  phoneNumber: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  department: string;

  @Expose()
  description: string;
}