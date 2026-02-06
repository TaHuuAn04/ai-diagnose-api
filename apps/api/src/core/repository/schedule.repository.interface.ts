 
import { ScheduleEntity } from '@app/core/domain/entities';

import { GetConsultingRoomDto } from '../../modules/appointment/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IScheduleRepository extends IGenericRepository<ScheduleEntity> {
    findRoomByDoctorAndShift(input: GetConsultingRoomDto): Promise<string | null>;
}
