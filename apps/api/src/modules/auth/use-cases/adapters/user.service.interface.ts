import { CreateUserBodyDto, CreateUserResponseDto } from '../../../user/dtos';
import { AuthPayload } from '../../interfaces';

export interface IUserService {
  createUser(dto: CreateUserBodyDto): Promise<CreateUserResponseDto>;
  getUserPayload(email: string): Promise<AuthPayload>;
}
