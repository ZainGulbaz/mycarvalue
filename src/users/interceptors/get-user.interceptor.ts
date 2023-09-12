import {NestInterceptor,ExecutionContext,CallHandler,Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import { UsersService } from "../users.service";
import { User } from "../users.repository";

@Injectable()
 export class GetUserInterceptorClass implements NestInterceptor {
    constructor(private userService: UsersService){}
    async intercept(context: ExecutionContext,next:CallHandler):Promise<Observable<any>>{

        const request= context.switchToHttp().getRequest();
        const session= request.session;
        const{userId}=session;
        let user:User|null;

        if(userId) user= await this.userService.findOne(userId);
        if(user && user.id)
        {
        request.user=user;
        
        }
        return next.handle();
        
    }
}