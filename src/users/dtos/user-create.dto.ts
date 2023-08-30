import {IsEmail,IsString} from "class-validator"; 

export class CreateUserDto{

    @IsEmail()
    email:string;
    
    @IsString({message:"Please enter a valid password"})
    password:string;

}