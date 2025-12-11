import { ShiftStatus } from '../enums';

import { BaseEntity } from './base';
import { WorkingTimeEntity } from './working-time';

export class ShiftEntity extends BaseEntity {
  date: string;

  from: string;

  to: string;

  status: ShiftStatus;

  workingTime?: WorkingTimeEntity[] | [];
}
