import { User } from './user';
export class Questionpool {
    questionpoolId: Int32Array;
    questionpoolName: string;
    createdDate: any;
    lastEdited: any;
    hastag:string;
    thumbnailImage: string;
    //quizCode: string;
    courseId: Int32Array;
    lessonId: number;
    quizCount:number;
    dateDistance:any;
    user : User;
}