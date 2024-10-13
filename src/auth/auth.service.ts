import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/api/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO, RegisterDTO } from './dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ){}
    async signIn(dto: AuthDTO){
        const user=await this.prisma.users.findUnique({
            where:{
                email: dto.email
            }
        });
        if(!user){
            throw new ForbiddenException('Such email doesn\'t exist');
        }
        const passwordMatches=await bcrypt.compare(dto.password, user.password);
        if(!passwordMatches){
            throw new ForbiddenException('Incorrect password');
        }
        return this.signToken(user.id, user.email, user.role);
    }

    async signUp(dto: RegisterDTO){
        const defaultRole='USER';
        const {name, surname, email, password}=dto;
        const hash=await bcrypt.hash(password,4);
        const user=await this.prisma.users.create({
            data:{
                name: name,
                surname: surname,
                email: email,
                password: hash,
                role: defaultRole
            }
        })
        return this.signToken(user.id, user.email, user.role)
    }

    async refreshToken(refreshToken: string) {
        try {
          const payload = this.jwt.verify(refreshToken, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
          });
          console.log("Payload:"+payload);
          return this.signToken(payload.id, payload.email, payload.role);
        } catch (e) {
          throw new UnauthorizedException('Invalid refresh token');
        }
      }

    async signToken(id: number, email: string, role: string){
        const payload={
            id,
            email,
            role
        }
        const secret=this.config.get('JWT_SECRET');
        const refreshSecret=this.config.get('JWT_REFRESH_SECRET')
        const accessToken=await this.jwt.signAsync(payload,{
            expiresIn: '15s',
            secret
        });
        const refreshToken=await this.jwt.signAsync(payload,{
            expiresIn: '7d',
            secret: refreshSecret
        });
        return {
            accessToken,
            refreshToken
        }
    }
}
