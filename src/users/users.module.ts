import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth-user.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { User } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService,AuthService],
  imports:[TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
