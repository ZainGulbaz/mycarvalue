import { NestInterceptor,ExecutionContext,CallHandler,UseInterceptors } from "@nestjs/common";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { plainToClass } from "class-transformer";
import Response from "src/types/Response";


export function Serialize(dtos){
  return UseInterceptors(new SerializeInterceptor<typeof dtos>(dtos))
}



export class SerializeInterceptor<T> implements NestInterceptor{

    constructor(public dtos:T){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
       return next.handle().pipe(map((responsePayload:Response)=>{
       let finalData={};
       Object.keys(responsePayload.data)?.map(entity=>{

        const plainClass= plainToClass(this.dtos[entity],responsePayload.data[entity],{
            excludeExtraneousValues:true
       })
       finalData={...finalData,[entity]:plainClass}
       }); 
       
        return {...responsePayload,data:finalData};
       }));
    }

}