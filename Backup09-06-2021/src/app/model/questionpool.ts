import { User } from './user';
export class Questionpool {
    questionpoolId: Int32Array;
    questionpoolName: string;
    createdDate: any;
    lastEdited: any;
    hastag:string;
    questionpoolThumbnailImage: string;
    questionpoolThumbnailImageURL: string;
    isActive:boolean;
    //quizCode: string;
    courseId: Int32Array;
    accountId: string;
    quizCount:number;
    dateDistance:any;
    user : User;
}