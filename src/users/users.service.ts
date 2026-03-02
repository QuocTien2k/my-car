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
    const checkEmailExists = await this.repo.findOne({ where: { email } });

    if (checkEmailExists) {
      throw new BadRequestException('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.repo.create({ email, password: hashedPassword });

    const savedUser = await this.repo.save(user);

    return this.findOneOrFail(savedUser.id);
  }

  // ================= FIND =================
  async findOneOrFail(id: number) {
    const user = await this.repo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmailOrFail(email: string) {
    const user = await this.repo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ================= UPDATE =================
  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOneOrFail(id);

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

    return this.findOneOrFail(id);
  }

  async remove(id: number) {
    const user = await this.findOneOrFail(id);

    return this.repo.remove(user);
  }
}
