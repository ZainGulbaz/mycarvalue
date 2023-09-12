import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth-user.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { User } from './users.repository';
import { GetUserInterceptorClass } from './interceptors/get-user.interceptor';

@Module({
  controllers: [UsersController],
  providers: [UsersService,AuthService,GetUserInterceptorClass],
  imports:[TypeOrmModule.forFeature([User])],
  exports:[GetUserInterceptorClass]
})
export class UsersModule {}
