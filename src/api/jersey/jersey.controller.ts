import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
} from '@nestjs/common';
import { JerseyService } from './jersey.service';
import { JerseyDTO } from './dto';
import { users } from '@prisma/client';
import { GetUser, Roles } from 'src/auth/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrderService } from '../order/order.service';
import RoleGuard from 'src/auth/guard/role.guard';

@Controller('jerseys')
export class JerseyController {
  constructor(
    private orderService: OrderService,
    private jerseyService: JerseyService,
  ) {}

  @Get()
  getJerseys() {
    return this.jerseyService.getJerseys();
  }

  @Get('get-by-team/:id')
  getJerseysByTeamId(id: number) {
    return this.jerseyService.getJerseysByTeamId(id);
  }

  @Get(':id')
  getJerseyById(@Param('id') id: number) {
    return this.jerseyService.getJerseyById(Number(id));
  }

  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('jerseyImage'))
  addJersey(
    @Body() dto: JerseyDTO,
    @UploadedFile() file,
    @GetUser() user: users,
  ) {
    console.log(file);
    return this.jerseyService.addNewJersey(dto, file.filename, user);
  }

  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @Put(':id')
  @UseInterceptors(FileInterceptor('jerseyImage'))
  updateJerseyInfo(
    @Body() dto: JerseyDTO,
    @Param('id') id: number,
    @UploadedFile() file,
  ) {
    return this.jerseyService.updateJersey(dto, Number(id), file.filename);
  }

  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteJersey(@Param('id') id: number) {
    const deleteOrderWithJersey = this.orderService.deleteOrdersByJerseyId(
      Number(id),
    );
    return this.jerseyService.deleteJersey(Number(id));
  }
}
