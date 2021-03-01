import {Lesson} from '../../model/lesson';
export interface TopicDialogData {
    topicId: number;
    topicTitle: string;
    lastUpdate: Date;
    sessionNumber: number;
    courseId: number;
  }
export interface QuizDialogData {
    quizId: Int32Array;
    quizName: string;
    createdDate: Date;
    lastEdited: Date;
    hastag:string;
    thumbnailImage: string;
    quizCode: string;
    lessonId: Int32Array;
    courseId: Int32Array;
}