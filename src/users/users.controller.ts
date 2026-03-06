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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ===== GET BY ID =====
  @Get('/:id')
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }

  // ===== GET BY EMAIL =====
  @Get()
  findUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // ===== UPDATE =====
  @UseGuards(AuthGuard)
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
