import {NestInterceptor,ExecutionContext,CallHandler,UseInterceptors,UnauthorizedException,HttpStatus,Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import { UsersService } from "../users.service";
import StringMessages from "src/constants/Messages";
import { User } from "../users.repository";


export function GetUserInterceptor(){
    return UseInterceptors(GetUserInterceptorClass);
}

@Injectable()
 class GetUserInterceptorClass implements NestInterceptor {
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
        return next.handle();
        }
        throw new UnauthorizedException({
            statusCode:HttpStatus.UNAUTHORIZED,
            message:[StringMessages.user.unauthorized],
            error:StringMessages.user.unauthorized
        })
        
    }
}