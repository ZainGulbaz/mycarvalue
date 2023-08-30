import { Expose } from "class-transformer";

export class UserInterceptorDto {

    @Expose()
    id:string;

    @Expose()
    email:string;
  
}