import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { users } from '@prisma/client';
import { UserDTO } from './dto';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get('me')
    getMe(@GetUser() user: users){
        console.log("Fuck "+JSON.stringify(user));
        return this.userService.getCurrentUser(user);
    }

    @Roles('ADMIN')
    @Get('all-users')
    getAllUsers(page: number){
        return this.userService.getAllUsers(page)
    }

    @Put('update-user')
    updateUserInfo(@GetUser() user: users, @Body() dto: UserDTO){
        return this.userService.updateUserInfo(user, dto)
    }
}
