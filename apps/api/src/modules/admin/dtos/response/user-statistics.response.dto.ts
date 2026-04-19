import { Expose, Type } from 'class-transformer';

export class RoleDistributionDto {
  @Expose()
  role: string;

  @Expose()
  count: number;
}

export class DepartmentDistributionDto {
  @Expose()
  department: string;

  @Expose()
  count: number;
}

export class UserStatisticsResponseDto {
  @Expose()
  @Type(() => RoleDistributionDto)
  roleDistribution: RoleDistributionDto[];

  @Expose()
  @Type(() => DepartmentDistributionDto)
  doctorDepartmentDistribution: DepartmentDistributionDto[];

  @Expose()
  @Type(() => DepartmentDistributionDto)
  staffDepartmentDistribution: DepartmentDistributionDto[];
}
