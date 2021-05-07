import {Lesson} from '../../model/lesson';
export interface TopicDialogData {
    topicId: number;
    topicTitle: string;
    lastUpdate: Date;
    sessionNumber: number;
    courseId: number;
  }
  export interface QuizDialogData {
    question : string;
    option1 : string;
    option2 :string;
    option3 : string;
    option4 : string ;
    option5 : string ;
    isCorrect: number;
    questionType:string ;
    imageQuestion: File;
    imageOption1 :File;
    imageOption2 :File;
    imageOption3 : File;
    imageOption4 :File;
    imageOption5 :File;
    imageURLQuestion: string;
    imageURLOption1 :string;
    imageURLOption2 :string;
    imageURLOption3 :string;
    imageURLOption4 :string;
    imageURLOption5 :string;
    description :string;
    time: number;
    tagtopic: string;
  }
export class QuestionpoolDialogData {
    questionpoolId: Int32Array;
    questionpoolName: string;
    createdDate: any;
    lastEdited: any;
    hastag:string;
    thumbnailImage: string;
    thumbnailImageURL: string;
    isActive:boolean;
    //quizCode: string;
    courseId: Int32Array;
    lessonId: number;
    isCreate: boolean;
    level: string;
    shareMethod: string;
}
  export interface ImageUploadDialogData {
    imageURL : string ;
    imageOption :File;
  }
  import { Topic} from '../../model/topic';
  export class SubtopicDialogData {
      subTopicId: Int32Array;
      subTopicTitle: string;
      subTopicNumber: number;
      topicId: Int32Array;
      topic: Topic;
      courseId:Int32Array;
  }
  import { Subtopic} from '../../model/subtopic';
  export class LessonDialogData {
    lessonId: Int32Array;
    lessonTitle: string;
    lessonContent:string;
    lessonNo: number;
    subTopic : Subtopic;
    subTopicId: Int32Array;
    courseId:Int32Array;
}