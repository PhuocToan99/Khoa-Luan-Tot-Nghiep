import {Subtopic} from '../model/subtopic';
export class Lesson {
    lessonId: Int32Array;
    lessonTitle: string;
    lessonContent:string;
    lessonNo: number;
    subTopic : Subtopic;
    subTopicId: Int32Array;
}
