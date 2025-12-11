import { PageDto } from '@app/core/dtos';

import { GetListDoctorRequestDto, GetListDoctorResponseDto } from './dtos';

export interface IDoctorService {
  getListDoctors(request: GetListDoctorRequestDto): Promise<PageDto<GetListDoctorResponseDto>>;
}
