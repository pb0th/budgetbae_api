import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UniqueConstraintException } from 'src/shared/exceptions/unique-constraint.exception';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create({ username, email, password }: CreateUserDto) {
    // checks if this email is already used by another user
    const emailExists = await this.findOneByEmail(email);
    if (emailExists)
      throw new UniqueConstraintException('Email is already taken');

    // checks if this username is already used by another user
    const usernameExists = await this.findOneByUsername(username);
    if (usernameExists)
      throw new UniqueConstraintException('Username is already taken');
    const newUser = await this.userRepo.create({
      email,
      username,
      password,
    });
    return await this.userRepo.save(newUser);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    return await this.userRepo.findBy({ id });
  }

  async findOneByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
    });
  }

  async findOneByUsername(username: string) {
    return await this.userRepo.findOne({
      where: { username },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
