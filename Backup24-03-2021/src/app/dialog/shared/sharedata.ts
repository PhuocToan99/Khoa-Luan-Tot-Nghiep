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
    imageQuestion: string;
    questionType:string ;
    imageOption1 :string;
    imageOption2 :string;
    imageOption3 : string;
    imageOption4 :string;
    imageOption5 :string;
    description :string;
    time: number;
    tagtopic: string;
  }