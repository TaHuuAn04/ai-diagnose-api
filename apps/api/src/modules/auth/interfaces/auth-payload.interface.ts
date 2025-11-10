import { UserRole } from '@app/core/domain/enums';

export interface AuthPayload {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneCode: string;
  phoneNumber: string;
}
