import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneById: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
        } as User);
      },

      findByEmail: (email: string) => {
        return Promise.resolve({
          id: 1,
          email,
        } as User);
      },

      findAllEmails: () => {
        return Promise.resolve(['test@test.com', 'demo@test.com']);
      },

      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: attrs.email ?? 'updated@test.com',
        } as User);
      },

      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'removed@test.com',
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  // ===== INIT =====
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ===== FIND BY ID =====
  it('findUserById returns a user', async () => {
    const user = await controller.findUserById(1);

    expect(user).toEqual({
      id: 1,
      email: 'test@test.com',
    });
  });

  // ===== FIND BY EMAIL =====
  it('findUserByEmail returns a user', async () => {
    const user = await controller.findUserByEmail('test@test.com');

    expect(user.email).toEqual('test@test.com');
  });

  // ===== UPDATE USER =====
  it('updateUser calls usersService.update', async () => {
    const result = await controller.updateUser(1, {
      email: 'updated@test.com',
    });

    expect(result.id).toEqual(1);
    expect(result.email).toEqual('updated@test.com');
  });

  // ===== DELETE USER =====
  it('removeUser calls usersService.remove', async () => {
    const result = await controller.removeUser(1);

    expect(result.id).toEqual(1);
  });
});
