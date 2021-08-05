import { Course } from "./course";
export class Certificate{
    certificateId:number;
    courseId:string;
    accountId:string;
    getDate:string;
}
export class CertificateFullInfo{
    course:Course;
    userName:string;
    avatarPath:string;
    getDate:string;
}