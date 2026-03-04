import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // ===== SIGN UP =====
  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);

    session.userId = user.id;

    return user;
  }

  @Serialize(UserDto)
  @Post('/login')
  async logIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);

    session.userId = user.id;

    return user;
  }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   if (!session.userId) {
  //     throw new UnauthorizedException('Not logged in');
  //   }
  //   return this.usersService.findOneById(session.userId);
  // }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    console.log('thong tin: ', user);
    return user;
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
    return { message: 'Logged out successfully' };
  }
}
