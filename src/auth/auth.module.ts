import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/api/user/user.service';
import { AuthStrategy } from './strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({ secret: process.env.JWT_SECRET || 'SECRET' })],
  providers: [PrismaService, AuthService, AuthStrategy, UserService],
  controllers: [AuthController]
})
export class AuthModule {}
