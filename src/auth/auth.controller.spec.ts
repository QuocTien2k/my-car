import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

describe('AuthController', () => {
  let controller: AuthController;

  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },

      login: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };

    fakeUsersService = {
      findOneById: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  // ===== INIT =====
  it('can create an instance of auth controller', () => {
    expect(controller).toBeDefined();
  });

  // ===== SIGNUP =====
  it('calls signup and sets session userId', async () => {
    const session = {};

    const user = await controller.signUp(
      {
        email: 'test@test.com',
        password: '123456',
      },
      session as any,
    );

    expect(user).toBeDefined();
    expect(session['userId']).toEqual(user.id);
  });

  // ===== LOGIN =====
  it('calls login and sets session userId', async () => {
    const session = {};

    const user = await controller.logIn(
      {
        email: 'test@test.com',
        password: '123456',
      },
      session as any,
    );

    expect(user).toBeDefined();
    expect(session['userId']).toEqual(user.id);
  });

  // ===== WHOAMI =====
  it('returns the current user', () => {
    const user = {
      id: 1,
      email: 'test@test.com',
    } as User;

    const result = controller.whoAmI(user);

    expect(result).toEqual(user);
  });

  // ===== LOGOUT =====
  it('clears the session on logout', () => {
    const session = { userId: 1 };

    const result = controller.logout(session as any);

    expect(session.userId).toBeNull();
    expect(result).toEqual({ message: 'Logged out successfully' });
  });
});
