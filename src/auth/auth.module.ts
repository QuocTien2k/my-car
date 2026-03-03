import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule], // import UsersModule
  providers: [AuthService],
  controllers: [],
})
export class AuthModule {}
