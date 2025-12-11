import { PageDto, PageOptionsDto } from '@app/core/dtos';

import { GetListDoctorResponseDto } from './dtos/response/get-list-doctor.response.dto';

export interface IDoctorService {
  getListDoctors(pageOptionsDto: PageOptionsDto): Promise<PageDto<GetListDoctorResponseDto>>;
}
