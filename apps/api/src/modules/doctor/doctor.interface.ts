import { PageDto } from '@app/core/dtos';

import { GetDoctorResponseDto, GetListDoctorRequestDto } from './dtos';

export interface IDoctorService {
  getListDoctors(request: GetListDoctorRequestDto): Promise<PageDto<GetDoctorResponseDto>>;

  getDoctorInfo(doctorId: string): Promise<GetDoctorResponseDto>;
}
