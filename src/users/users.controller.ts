import { Controller,Post,Get,Put,Delete,Param,Query,Body,Res,Session} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth-user.service';
import { CreateUserDto } from './dtos/user-create.dto';
import { GetUserByIdDto } from './dtos/user-id.dto';
import { GetUsersByEmail } from './dtos/users.dto';
import { UpdateUserDto } from './dtos/user-update.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import {Response} from "express";
import { UserInterceptorDto } from './dtos/user-interceptor.dto';
import { GetUser } from './decorator/user-get.decorator';
import { GetUserInterceptor } from './interceptors/get-user.interceptor';


@Controller()
export class UsersController {

    constructor(private userService:UsersService, private authService:AuthService){}

    @Post("user/create")
    async createUser(@Body() body:CreateUserDto,@Res({ passthrough: true }) res: Response){
        let json=await this.userService.create(body);
        res.status(json.statusCode).json(json);
    }

    @Serialize({user:UserInterceptorDto})
    @Get("user/:id")
    async getUserById(@Param() params:GetUserByIdDto,@Res({ passthrough: true }) res: Response){ 
         return await this.userService.findOne(params.id);
    }
    

    @Serialize({users:UserInterceptorDto})
    @Get("user")
    async getUsers(@Query() queryParams:GetUsersByEmail, @Res({passthrough:true}) res:Response){
        return await this.userService.find(queryParams.email);     
    }

    @Put("user/:id")
    async updateUser(@Param() params:{id:string}, @Body() body:UpdateUserDto, @Res({passthrough:true}) res:Response){
        const json= await this.userService.update(parseInt(params.id),body);
        res.status(json.statusCode).json(json);
    }

    @Post("auth/signup")
    async signup(@Body() body:CreateUserDto,@Session() session:any){

        let response= await this.authService.signup(body.email,body.password);
        if(response.data && response.data.user) session.userId=response.data.user.id;
        return response;
    }

    @Post("auth/signin")
    async signin(@Body() body:CreateUserDto, @Session() session:any){
        
        let response= await this.authService.signin(body.email,body.password);
        if(response.data && response.data.user) session.userId=response.data.user.id;
        return response; 
        
    }

    @GetUserInterceptor()
    @Get("whoami")
    async whoami(@GetUser() user:any){
        return user;
    }


}
