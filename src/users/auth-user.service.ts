import { BadRequestException, HttpStatus, Injectable,UnauthorizedException } from "@nestjs/common";
import { scrypt as _scrypt,randomBytes } from "crypto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.repository";
import { promisify } from "util";
import { UsersService } from "./users.service";
import { initializeResponsePayload } from "src/utils/CommonFunctions";
import StringMessages from "src/constants/Messages";
const scrypt=promisify(_scrypt);
import Response from "src/types/Response";
import { GetUser } from "./decorator/user-get.decorator";

@Injectable()
export class AuthService{

    constructor(private userService:UsersService,@InjectRepository(User) private userRepository:Repository<User>){}

    async signup(email:string,password:string):Promise<Response>{
        let responsePayload= initializeResponsePayload();
        
        try{ 
            
            const userFound= await this.userService.findUserByEmail(email);
            if(userFound && userFound.id) throw new UnauthorizedException({
                statusCode:HttpStatus.UNAUTHORIZED,
                message:[StringMessages.user.signup_failure],
                error:StringMessages.user.user_email_already_exists
            });
             
            const encryptedPassword=await this.hashPassword(password);
            
            const newUser= this.userRepository.create({email,password:encryptedPassword as string});

            const user= await this.userRepository.save(newUser);

            if(!user || !user.id)
            {
                throw new Error(StringMessages.user.user_database_error);
            }

            responsePayload.statusCode=HttpStatus.CREATED;
            responsePayload.message.push(StringMessages.user.signup_success);
            responsePayload.data={
                user
            }

            return responsePayload;
        }
        catch(err)
        {
             if(err.response && err.response.statusCode== HttpStatus.UNAUTHORIZED) throw new UnauthorizedException(err.response) ;

             throw new BadRequestException({
                statusCode:HttpStatus.BAD_REQUEST,
                message:[StringMessages.user.signup_failure],
                error:err.message
             })
        }
    }
    
    async signin(email:string, password:string):Promise<Response>{
        try{
            let responsePayload=initializeResponsePayload();

            let user= await this.userService.findUserByEmail(email);

            if(!user || !user.id) throw new UnauthorizedException({
                statusCode:HttpStatus.UNAUTHORIZED,
                message:[StringMessages.user.login_failure],
                error:StringMessages.user.login_email_failure
            });

            const [salt,hash]=user.password.split(".");

            if(!salt || !hash){
                throw new UnauthorizedException({
                    statusCode:HttpStatus.UNAUTHORIZED,
                    message:[StringMessages.user.login_failure],
                    error:StringMessages.user.password_verfication_failure
                });
            }

            let hashPassword= await scrypt(password,salt,16) as Buffer;
            if(hashPassword.toString("hex")!==hash){
                throw new UnauthorizedException({
                    statusCode:HttpStatus.UNAUTHORIZED,
                    message:[StringMessages.user.login_failure],
                    error:StringMessages.user.incorrect_password
                });
                
            }
           
            responsePayload.data={user};
                responsePayload.statusCode=HttpStatus.OK;
                responsePayload.message.push(StringMessages.user.login_success);
                return responsePayload;
        }
        catch(err)
        {
            if(err.response.statusCode==HttpStatus.UNAUTHORIZED) throw new UnauthorizedException(err.response);

            throw new BadRequestException({
                statusCode:HttpStatus.BAD_REQUEST,
                message:[StringMessages.user.login_failure],
                error:err.message
            })
            
        }
    }


    private async hashPassword(plainPassword:string):Promise<String>{
        try{

            let salt= randomBytes(8).toString("hex");
            let hashPassword= await scrypt(plainPassword,salt,16) as Buffer;
        
            return salt+"."+hashPassword.toString("hex")

        }
        catch(err)
        {
            throw new Error(err);
        }

    }
}