import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GetMonthlyDiseasesResponseDto {
  @Expose()
  diseaseName: string;

  @Expose()
  count: number;
}