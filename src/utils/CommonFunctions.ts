import {HttpStatus} from "@nestjs/common";
import Response from "src/types/Response";

export function initializeResponsePayload():Response{
     return {
        statusCode:HttpStatus.AMBIGUOUS,
        message:[],
        data:{}
      };
}