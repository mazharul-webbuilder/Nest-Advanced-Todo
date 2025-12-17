import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Non-null assertion/cast so TypeScript knows this is a string
      secretOrKey: (process.env.JWT_SECRET as string) ?? 'top-secret',
    });
  }

  async validate(payload: any) {
    // runs on every protected request
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
