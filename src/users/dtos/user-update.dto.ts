import { IsEmail,IsString,IsOptional } from "class-validator";

export class UpdateUserDto{
  
    @IsEmail()
    @IsOptional()
    email:string;

    @IsString({message:"Please provide a valid password"})
    @IsOptional()
    password:string;
}