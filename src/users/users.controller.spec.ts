import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneById: async (id: number) => {
        if (id === 1) {
          return { id, email: 'test@test.com' } as User;
        }

        throw new NotFoundException('User not found');
      },

      findByEmail: async (email: string) => {
        if (email === 'test@test.com') {
          return { id: 1, email } as User;
        }

        return null;
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

  it('findUserById throws NotFoundException if user does not exist', async () => {
    await expect(controller.findUserById(10)).rejects.toThrow(
      NotFoundException,
    );
  });

  // ===== FIND BY EMAIL =====
  it('findUserByEmail returns a user', async () => {
    const user = await controller.findUserByEmail('test@test.com');

    expect(user.email).toEqual('test@test.com');
  });

  it('findUserByEmail returns null if email not found', async () => {
    const user = await controller.findUserByEmail('unknown@test.com');

    expect(user).toBeNull();
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
