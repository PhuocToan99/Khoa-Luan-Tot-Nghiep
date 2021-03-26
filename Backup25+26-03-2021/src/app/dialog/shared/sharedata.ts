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
    imageOption1 :File;
    imageOption2 :File;
    imageOption3 : File;
    imageOption4 :File;
    imageOption5 :File;
    description :string;
    time: number;
    tagtopic: string;
  }