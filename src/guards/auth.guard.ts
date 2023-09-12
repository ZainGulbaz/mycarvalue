import {CanActivate,ExecutionContext,UnauthorizedException,HttpStatus,Injectable} from "@nestjs/common";
import StringMessages from "src/constants/Messages";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private userService:UsersService){}
    async canActivate(context:ExecutionContext){
        const request= context.switchToHttp().getRequest();
        const userId=request.session.userId;
        if(userId==null)
        {
            throw new UnauthorizedException({
                statusCode:HttpStatus.UNAUTHORIZED,
                message:[StringMessages.user.unauthorized],
                error:StringMessages.user.unauthorized
            })
        }
        else{
            
            let user= await this.userService.findOne(userId);
            if(user.id==null)
            {
                throw new UnauthorizedException({
                    statusCode:HttpStatus.UNAUTHORIZED,
                    message:[StringMessages.user.single_user_not_found],
                    error:StringMessages.user.unauthorized
                })

            }

        }
        return userId;
    }
}