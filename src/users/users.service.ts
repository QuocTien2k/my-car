import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  // ================= FIND =================
  async findOneById(id: number) {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'password'], // dùng cho login lấy password
    });
  }

  async findAllEmails(): Promise<string[]> {
    const users = await this.repo.find({
      select: ['email'],
    });

    return users.map((user) => user.email);
  }

  // ================= UPDATE =================
  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOneById(id);

    if (!user) {
    }

    // check email duplicate
    if (attributes.email) {
      const existingUser = await this.repo.findOne({
        where: { email: attributes.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already exists');
      }
    }

    // hash password if updated
    if (attributes.password) {
      attributes.password = await bcrypt.hash(attributes.password, 10);
    }

    Object.assign(user, attributes);

    await this.repo.save(user);

    return this.findOneById(id);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);

    return this.repo.remove(user);
  }
}
