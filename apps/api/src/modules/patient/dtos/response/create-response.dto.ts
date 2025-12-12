import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CreatePatientResponseDto {
  @Expose()
  userId: string;

  @Expose()
  folk: string;

  @Expose()
  address: string;
  
  @Expose()
  citizenCode: string;

  @Expose()
  medicalInsurance: string;
}