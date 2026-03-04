import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
  imports: [UsersModule], // import UsersModule
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
