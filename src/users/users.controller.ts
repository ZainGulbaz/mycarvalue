import { Controller,Post,Get,Put,Delete,Param,Query,Body,Res} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/user-create.dto';
import { GetUserByIdDto } from './dtos/user-id.dto';
import { GetUsersByEmail } from './dtos/users.dto';
import { UpdateUserDto } from './dtos/user-update.dto';
import {Response} from "express";
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserInterceptorDto } from './dtos/user-interceptor.dto';

@Controller()
export class UsersController {

    constructor(private userService:UsersService){}

    @Post("auth/signup")
    async createUser(@Body() body:CreateUserDto,@Res({ passthrough: true }) res: Response){
        let json=await this.userService.create(body);
        res.status(json.statusCode).json(json);
    }

    @Serialize({user:UserInterceptorDto})
    @Get("user/:id")
    async getUserById(@Param() params:GetUserByIdDto,@Res({ passthrough: true }) res: Response){ 
         return await this.userService.findOne(params.id,res);
    }
    
    @Serialize({users:UserInterceptorDto})
    @Get("user")
    async getUsers(@Query() queryParams:GetUsersByEmail, @Res({passthrough:true}) res:Response){
        return await this.userService.find(queryParams.email,res);     
    }

    @Put("user/:id")
    async updateUser(@Param() params:{id:string}, @Body() body:UpdateUserDto, @Res({passthrough:true}) res:Response){
        const json= await this.userService.update(parseInt(params.id),body);
        res.status(json.statusCode).json(json);
    }

    @Delete("user/:id")
    async deleteUser(@Param() params:{id:string},@Res({passthrough:true}) res:Response){
        const json= await this.userService.remove(parseInt(params.id));
        res.status(json.statusCode).json(json);
    }

}
