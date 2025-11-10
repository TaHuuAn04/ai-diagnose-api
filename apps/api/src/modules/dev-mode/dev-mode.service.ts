import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth/infrastructures/auth.service';

@Injectable()
export class DevModeService {
  constructor(private readonly authService: AuthService) {}

  async login(email: string) {
    return this.authService.getUserTokenDevMode(email);
  }
}
