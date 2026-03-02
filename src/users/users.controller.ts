import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ===== SIGN UP =====
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password);
  }

  // ===== GET BY ID =====

  @Get('/:id')
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneOrFail(id);
  }

  // ===== GET BY EMAIL =====
  @Get()
  findUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmailOrFail(email);
  }

  // ===== UPDATE =====
  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  // ===== DELETE =====
  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
