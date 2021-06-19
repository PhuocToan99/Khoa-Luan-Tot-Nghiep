import {Lesson} from '../../model/lesson';
export interface TopicDialogData {
    topicId: number;
    topicTitle: string;
    lastUpdate: Date;
    sessionNumber: number;
    courseId: number;
    isLocked:boolean;
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
export class ExamQuizDialogData {
  examQuizId :Int32Array;
    examQuestion: string;
    examIsCorrect: string;
    examOption1 : string;
    examOption2: string;
    examOption3 : string;
    examOption4 : string;
    examOption5 : string;
    examQuestionImageURL:string;
    examOptionImageURL1:string;
    examOptionImageURL2:string;
    examOptionImageURL3:string;
    examOptionImageURL4:string;
    examOptionImageURL5:string;
    ExamQuestionImage:string;
    examOptionImage1 :string;
    examOptionImage2 :string;
    examOptionImage3 :string;
    examOptionImage4 :string;
    examOptionImage5 :string;
    examTagTopic :string;
    examQuizCode :string;
    examCourseId:string;
    examTime: number;
    examQuizName:string;
    quizId :string;
    isEdited: boolean;
    isBlocked:boolean;
}
import {ExamQuiz} from '../../model/examquiz';
import { Account } from 'src/app/model/Account';
export class ExamQuizListDialogData {
  examQuizList :ExamQuiz [];
  isSave:boolean;
}
export class InvoiceDialogData{
  invoiceCode: string;
  createDate:string;
  totalCourse:string;
  payMethod:string;
  totalPrice:string;
  currentAccount:Account;
  isBought:boolean;
  isInfo:boolean;
  isInstructor:boolean;
}
export class CommentDialogData {
  commentId: Int32Array;
  commentContent: string;
  rating: number;
  datePost: string;
  type: string;
  userId: string;
  courseId: string;
  lessonId: string;
}
export class CourseDialogData {
  courseId: Int32Array;
  courseName: string;
  courseDuration: string;    
  description: string;
  startDate: Date;
  lastUpdate: Date;
  hastag: string;
  level: string;
  thumbnailImage: File;
  rating: number;
  numberOfVoters: number;
  numberOfParticipants: number;
  price: number;
  lessonNumbers: number;
  isActive:boolean;
  accountId: Int32Array;
}