import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './interface/user.repository.interface';
import { User, UserDocument } from 'src/database/mongoose/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}
  async create(data: Partial<User>): Promise<UserDocument> {
    return await this.model.create(data);
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email });
  }
  async updateProfile(
    id: string,
    data: Partial<User>,
  ): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate(id, data);
  }
}
