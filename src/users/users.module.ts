import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { User } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
