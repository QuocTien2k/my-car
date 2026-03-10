import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieSession from 'cookie-session';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Report } from 'src/reports/reports.entity';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [
    //     TypeOrmModule.forRoot({
    //       type: 'sqlite',
    //       database: ':memory:',
    //       entities: [User, Report],
    //       synchronize: true,
    //       dropSchema: true,
    //     }),
    //     AuthModule,
    //     UsersModule,
    //   ],
    // }).compile();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(
      cookieSession({
        keys: ['test_key'],
      }),
    );

    await app.init();
  });

  it('signup successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);

    expect(res.body.email).toEqual('test@test.com');
    expect(res.body).toHaveProperty('id');
  });

  it('fails if email already exists', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'duplicate@test.com',
      password: '123456',
    });

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'duplicate@test.com',
        password: '123456',
      })
      .expect(400);
  });

  it('login successfully', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'login@test.com',
      password: '123456',
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'login@test.com',
        password: '123456',
      })
      .expect(201);

    expect(res.body.email).toEqual('login@test.com');
  });

  it('fails login with wrong password', async () => {
    await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'wrongpass@test.com',
      password: '123456',
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'wrongpass@test.com',
        password: 'wrongpassword',
      })
      .expect(400);
  });

  it('fails login if email not found', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'notfound@test.com',
        password: '123456',
      })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
