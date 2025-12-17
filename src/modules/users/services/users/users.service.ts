import { Injectable } from '@nestjs/common';
import {
  User,
  UserDocument,
} from 'src/database/mongoose/schemas/user.schema';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: Partial<User>): Promise<UserDocument> {
    return this.userRepository.create(data);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateProfile(
    id: string,
    data: Partial<User>,
  ): Promise<UserDocument | null> {
    return this.userRepository.updateProfile(id, data);
  }
}
