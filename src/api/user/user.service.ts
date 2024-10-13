import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {users} from '@prisma/client'
import { UserDTO } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async getCurrentUser(user: users){
        console.log('User:'+JSON.stringify(user));
        return user;
    }

    async getAllUsers(page: number){
        return await this.prisma.users.findMany({
            select:{
                id: true,
                name: true,
                surname: true,
                email: true
            },
            skip: page,
            take: 30
        })
    }

    async updateUserInfo(user: users, dto: UserDTO){
        return await this.prisma.users.update({
            data: dto,
            where:{
                id: user.id
            }
        })
    }
}
