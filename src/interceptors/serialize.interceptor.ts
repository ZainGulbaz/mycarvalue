import { ExecutionContext,CallHandler, NestInterceptor } from "@nestjs/common/interfaces";
import { UseInterceptors } from "@nestjs/common/decorators";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { plainToClass, plainToInstance } from "class-transformer";
import Response from "src/types/Response";


export function Serialize(dtos){
  return UseInterceptors(new ResponseSerialization(dtos));
}


export class ResponseSerialization implements NestInterceptor{

  constructor(public dtos:any){}
  
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

   return next.handle().pipe(map((responsePayload:Response)=>{
    const responseData=responsePayload.data;
    let finalData={};
    Object.keys(responseData)?.map((entity)=>{

      const refinedData= plainToInstance(this.dtos[entity],responsePayload.data[entity],{
        excludeExtraneousValues:true
      });
      finalData={...finalData,[entity]:refinedData};
    })   
  
    responsePayload.data=finalData;
    return responsePayload;
                
  }))
}
}