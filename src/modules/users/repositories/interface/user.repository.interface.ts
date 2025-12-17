import {
  User,
  UserDocument,
} from '../../../../database/mongoose/schemas/user.schema';

export interface UserRepositoryInterface {
  create(data: Partial<User>): Promise<UserDocument>;
  findByEmail(email: string): Promise<UserDocument | null>;
  updateProfile(id: string, data: Partial<User>): Promise<UserDocument | null>;
}
