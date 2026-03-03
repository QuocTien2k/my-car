import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ===== SIGN UP =====
  @Post('/signup')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Serialize(UserDto)
  @Post('/login')
  logIn(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
  }
}
