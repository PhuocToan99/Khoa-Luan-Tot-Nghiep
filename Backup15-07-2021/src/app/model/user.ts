import { Account } from '../model/Account'
export class User {
    userId: Int32Array;
    firstName: string;
    lastName: string;    
    gender: string;
    createdDate: Date;
    lastLogOnDate: Date;
    email: string;
    phoneNumber: string;
    avatarPath: string;
    balance: number;
    description: string;
    account: Account;
}
export class InstructorProfile
{
    review:number;
    course:number;
    student:number;
    instructorName:string;
    description:string;
    avatarPath: string;
}