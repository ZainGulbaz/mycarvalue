import {HttpStatus} from "@nestjs/common";
import StringMessages from "src/constants/Messages";

type StringMessagesKeyType=typeof StringMessages[keyof typeof StringMessages]

type Response={
   statusCode:HttpStatus,
   message:StringMessagesKeyType[keyof StringMessagesKeyType][]
   data?:any
}

export default Response;
