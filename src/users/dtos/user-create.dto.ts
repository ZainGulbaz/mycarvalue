import {IsEmail,IsString,MinLength} from "class-validator"; 

export class CreateUserDto{

    @IsEmail()
    email:string;
    
    @IsString({message:"Please enter a valid password"})
    @MinLength(7)
    password:string;

}