import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      findByEmail: (email: string) => {
        const user = users.find((user) => user.email === email);
        return Promise.resolve(user || null);
      },

      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  //giả lập khởi tạo auth
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  //giả lập mật khẩu đã hash
  it('hashes the password when creating a new user', async () => {
    const user = await service.signup('nguyenvand@gmail.com', '123456');

    expect(user.password).not.toEqual('123456');

    const isMatch = await bcrypt.compare('123456', user.password);
    expect(isMatch).toBe(true);
  });

  //giả lập email đã sử dụng
  it('throws an error if user signs up with email that is in use', async () => {
    //existing user
    fakeUsersService.findByEmail = (email: string) => {
      if (email === 'test@test.com') {
        //thay đổi email để test
        return Promise.resolve({
          id: 1,
          email,
          password: 'hashed',
        } as User);
      }
      return Promise.resolve(null);
    };

    await expect(service.signup('test@test.com', '123456')).rejects.toThrow(
      BadRequestException,
    );
  });

  //giả lập email ko hợp lệ
  it('throws if login is called with an unused email', async () => {
    await expect(service.login('notfound@test.com', '123456')).rejects.toThrow(
      BadRequestException,
    );
  });

  //giả lập mật khẩu ko hợp lệ
  it('throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', 'correctpassword');

    await expect(
      service.login('test@test.com', 'wrongpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  //giả lập mật khẩu hợp lệ
  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'mypassword');

    const user = await service.login('test@test.com', 'mypassword');

    expect(user).toBeDefined();
  });
});
