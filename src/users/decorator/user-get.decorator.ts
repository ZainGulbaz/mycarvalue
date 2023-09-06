import  {createParamDecorator, ExecutionContext} from "@nestjs/common";


export const GetUser=createParamDecorator((data:any,context:ExecutionContext)=>{
    let request= context.switchToHttp().getRequest();
    const {user}=request;
    return user;
})