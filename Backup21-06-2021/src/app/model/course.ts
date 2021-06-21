export class Course {
    courseId: Int32Array;
    courseName: string;
    courseDuration: string;    
    description: string;
    startDate: Date;
    lastUpdate: Date;
    hastag: string;
    level: string;
    thumbnailImage: string;
    rating: number;
    numberOfVoters: number;
    numberOfParticipants: number;
    price: number;
    lessonNumber: number;
    isActive:boolean;
    viewCount:number;
    accountId: Int32Array;
}
import { User } from '../model/user';
export class CourseDesktopData {
    course: Course;
    user: User;
}
export class CourseDataSet{
    course: Course;
    rating: number;
    check:boolean;
    nonFormatedDescription:string;
}
