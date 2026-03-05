import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //fake user service
    fakeUsersService = {
      findByEmail: () => Promise.resolve(null),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('hashes the password when creating a new user', async () => {
    const user = await service.signup('nguyenvand@gmail.com', '123456');

    expect(user.password).not.toEqual('123456');

    const isMatch = await bcrypt.compare('123456', user.password);
    expect(isMatch).toBe(true);
  });

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
});
