import { Module } from '@nestjs/common';
import { JerseyModule } from './api/jersey/jersey.module';
import { TeamModule } from './api/team/team.module';
import { OrderModule } from './api/order/order.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    JerseyModule, 
    TeamModule, 
    OrderModule, 
    AuthModule,
    UserModule
  ]
})
export class AppModule {}
