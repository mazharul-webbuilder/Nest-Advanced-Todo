import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await this.usersService.createUser({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    });

    // In Mongoose documents, the id getter maps to _id as string
    const userId = (user as any).id ?? (user as any)._id?.toString();

    const accessToken = await this.signToken(userId, user.email);

    return {
      accessToken,
    };
  }

  async login(payload: LoginDto) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.signToken(user.id, user.email);

    return {
      accessToken,
    };
  }

  private async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    return this.jwtService.signAsync(payload);
  }
}
