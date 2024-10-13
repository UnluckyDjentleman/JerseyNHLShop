import { Injectable, NotFoundException } from '@nestjs/common';
import { users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDTO } from './dto/order.dto';
import { GetUser } from 'src/auth/decorator';

@Injectable()
export class OrderService {
    constructor(private prisma:PrismaService){}
    async PostOrder(@GetUser() user: users, dto: OrderDTO){
        const userHasOrder=await this.prisma.orders.findFirst({
            where:{
                userid: user.id,
                jerseyid: dto.jerseyid
            }
        })
        let addedOrder;
        if(userHasOrder){
            const id=userHasOrder.id
            const count=userHasOrder.count
            addedOrder=await this.prisma.orders.update({
                data:{
                    count: count+1
                },
                where:{
                    id
                }
            })
        }
        else{
            addedOrder=await this.prisma.orders.create({
                data:{
                    userlastname: dto.userLastName,
                    number: dto.jerseyNumber,
                    jerseyid: dto.jerseyid,
                    count: 1,
                }
            })
        }
        return addedOrder;
    }
    async UpdateOrder(id: number, @GetUser() user: users, dto: OrderDTO){
        const userHasOrder=await this.prisma.orders.findFirst({
            where:{
                userid: user.id,
                jerseyid: dto.jerseyid
            }
        })
        if(!userHasOrder){
            throw new NotFoundException('Not found in this cart')
        }
        const updatedOrder=await this.prisma.orders.update({
            where:{
                id
            },
            data:{
                userlastname: dto.userLastName,
                number: dto.jerseyNumber
            }
        });
        return updatedOrder;
    }
    async DeleteOrder(id: number, @GetUser() user: users){
        const userHasOrder=await this.prisma.orders.findFirst({
            where:{
                id,
                userid: user.id
            }
        })
        if(!userHasOrder){
            throw new NotFoundException('Not found order');
        }
        return await this.prisma.orders.delete({
            where:{
                id,
                userid: user.id
            }
        });
    }
    async GetUserOrders(id: number){
        return await this.prisma.orders.findMany({
            where:{
                userid: id
            }
        })
    }
    async GetAllOrders(){
        return await this.prisma.orders.findMany()
    }
    async deleteOrdersByJerseyId(id: number){
        return await this.prisma.orders.deleteMany({
            where:{
                jerseyid: id
            }
        })
    }
}
