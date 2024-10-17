import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLE_KEY } from '../decorator';
import { PrismaService } from './../../prisma/prisma.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist';
@Injectable()
export default class RoleGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private reflector: Reflector,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    try {
      const token = req.cookies.accessToken;
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLE_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      if (!token) throw new UnauthorizedException(`You are not authorized`);
      console.log(this.config.get('JWT_SECRET'));
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      req.user = payload;
      console.log(req.user);
      const user = await this.prisma.users
        .findUnique({
          where: {
            email: req.user.email,
          },
        })
        .then((user) => {
          console.log('Returned User:' + JSON.stringify(user));
          return user;
        });
      return requiredRoles.includes(user.role);
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException("You don't have enough permissions!");
    }
  }
}
