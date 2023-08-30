import { Injectable,HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dtos/user-create.dto';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import { User } from './users.repository';
import Response from 'src/types/Response';
import StringMessages from 'src/constants/Messages';
import { DBErrors } from 'src/constants/DBErrorCodes';
import { initializeResponsePayload } from 'src/utils/CommonFunctions';
import {Response as ExpressResponse, response} from "express";
@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository:Repository<User> ){}

    async create(body:CreateUserDto):Promise<Response>{
        let responsePayload:Response=initializeResponsePayload();
        try{
          
            const password=body.password;
          const email=body.email;
          let userToCreate=  this.userRepository.create({
            email,
            password
          });
          
          let createdUser= await this.userRepository.save(userToCreate);
          if(createdUser.id)
          {
            responsePayload.statusCode=HttpStatus.CREATED;
            responsePayload.message.push(StringMessages.user.user_created_success);
            responsePayload.data={
                user:body
            }
            return;
          }
     
            throw new Error(StringMessages.user.user_database_error);
        
        }
        catch(err)
        {

            responsePayload.statusCode=HttpStatus.BAD_REQUEST;            
            if(err.driverError.errno==DBErrors.Unique_Error){
              responsePayload.message.push(StringMessages.user.user_email_already_exists);
            }
            else responsePayload.message.push(StringMessages.user.user_created_error);
            responsePayload.message.push(err.message);
        }
        
        finally{

            return responsePayload;

        }
          
    }

    async findOne(id:number,res:ExpressResponse):Promise<Response>{
      let responsePayload:Response=initializeResponsePayload();
      try{

        let user= await this.userRepository.findOne({where:{id}});
        if(user)
        {
          responsePayload.data={
            user
          };
          responsePayload.statusCode=HttpStatus.FOUND;
          responsePayload.message.push(StringMessages.user.single_user_found);
          return;
        }

        throw new Error(StringMessages.user.single_user_not_found_database);         
      }
      catch(err)
      {
        responsePayload.statusCode=HttpStatus.NOT_FOUND;
        responsePayload.message.push(StringMessages.user.single_user_not_found);
        responsePayload.message.push(err.message);
        return;
      }
      finally{
        res.status(responsePayload.statusCode);
        return responsePayload;

      }
    }

    async find(email:string,res:ExpressResponse):Promise<Response>{
      let responsePayload=initializeResponsePayload();
      try{
        let users= await this.userRepository.find({where:{email}})
        if(users.length)
        {
          responsePayload.message.push(StringMessages.user.multiple_user_found);
          responsePayload.statusCode=HttpStatus.FOUND;
          responsePayload.data={
            users
          }
          return;
        }
         
        throw new Error(StringMessages.user.multiple_user_not_found_database)

      }
      catch(err)
      {
           responsePayload.statusCode=HttpStatus.NOT_FOUND;
           responsePayload.message.push(StringMessages.user.multiple_user_not_found);
           responsePayload.message.push(err.message);
      }
      finally{
        res.status(responsePayload.statusCode);
        return responsePayload;
      }


    }

    async update(id:number,attributes:Partial<User>):Promise<Response>{
      let responsePayload:Response=initializeResponsePayload();
      try{

        let user= await this.userRepository.findOne({where:{id}});
        if(!user)
        { 
          responsePayload.message.push(StringMessages.user.single_user_not_found);  
          throw new Error(StringMessages.user.single_user_not_found_database);
        }

        let updatedUser= await this.userRepository.save(Object.assign(user,attributes));

        if(updatedUser.id){

          responsePayload.message.push(StringMessages.user.update_user_success);
          responsePayload.statusCode=HttpStatus.OK;
          responsePayload.data={
            user:updatedUser
          }

        }

          
      }
      catch(err)
      {  

        console.error(err);
        
        if(err.driverError.errno==DBErrors.Unique_Error){
          responsePayload.message.push(StringMessages.user.user_email_already_exists);
        }

        responsePayload.message.push(StringMessages.user.update_user_fail);
        responsePayload.message.push(err.message);
        responsePayload.statusCode=HttpStatus.BAD_REQUEST;
        

      }
      finally{
        return responsePayload;
      }
    }

    async remove(id:number){

      let responsePayload = initializeResponsePayload();
      try{
        let user= await this.userRepository.findOne({where:{id}});

        if(!user){
          responsePayload.message.push(StringMessages.user.single_user_not_found);
          throw new Error(StringMessages.user.single_user_not_found_database);
        }

        let deletedUser= await this.userRepository.remove(user);
        
        if(deletedUser.email)
        {
          responsePayload.message.push(StringMessages.user.delete_user_success);
          responsePayload.statusCode=HttpStatus.OK;
          responsePayload.data={user:deletedUser};
          return;
        }

        else throw new Error(StringMessages.user.delete_user_database_error);
      
      }
      catch(err){

        responsePayload.message.push(StringMessages.user.delete_user_fail);
        responsePayload.message.push(err.message);
        responsePayload.statusCode=HttpStatus.BAD_REQUEST;
        
      }
      finally{
            return responsePayload;
      }
    }
}
