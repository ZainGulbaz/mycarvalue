import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.repository';
import { Report } from './reports/reports.repository';
import { GetUserInterceptorClass } from './users/interceptors/get-user.interceptor';

@Module({
  imports: [TypeOrmModule.forRoot({
    type:"sqlite",
    database:"db.sqlite",
    entities:[User,Report],
    synchronize:true
  }),UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
