import { Controller, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { users } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';
import { OrderDTO } from './dto/order.dto';
import RoleGuard from 'src/auth/guard/role.guard';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService){}

    @Get("order-by-user")
    getUserOrders(user: users){
        return this.orderService.GetUserOrders(user.id)
    }

    @UseGuards(RoleGuard)
    @Roles('ADMIN')
    @Get('all-orders')
    getAllOrders(){
        return this.orderService.GetAllOrders()
    }

    @Post('add-order')
    addOrder(user: users, dto: OrderDTO){
        return this.orderService.PostOrder(user,dto)
    }

    @Put('update-order/:id')
    updateOrder(id: number, user: users, dto: OrderDTO){
        return this.orderService.UpdateOrder(id, user, dto)
    }

    @Delete('delete-order/:id')
    deleteOrder(id: number, user: users){
        return this.orderService.DeleteOrder(id, user)
    }
}
