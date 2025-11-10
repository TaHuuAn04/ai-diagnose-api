import { AuthModule } from './auth/auth.module';
import { DevModeModule } from './dev-mode/dev-mode.module';
import { UserModule } from './user/user.module';
export const modules = [UserModule, AuthModule, DevModeModule.registerAsync()];
