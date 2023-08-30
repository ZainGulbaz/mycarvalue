import { IsEmail } from "class-validator";

export class GetUsersByEmail{
    @IsEmail()
    email:string;
}