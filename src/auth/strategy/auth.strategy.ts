import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config/dist';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { id: number; email: string; role: string }) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.id },
    });
    return user;
  }
}
