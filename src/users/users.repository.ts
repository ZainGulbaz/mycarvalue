import {Entity,Column,PrimaryGeneratedColumn,AfterInsert,AfterRemove,AfterUpdate} from "typeorm";
import { IsEmail, Min } from "class-validator";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    @IsEmail()
    email:string;

    @Column()
    @Min(7)
    password:string;

    @AfterInsert()
    logInsert(){
        console.log("A new user is saved with id", this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log("The user is updated with id", this.id);
    }

    @AfterRemove()
    logDelete(){
        console.log("The user is deleted with id", this.id);
    }
}