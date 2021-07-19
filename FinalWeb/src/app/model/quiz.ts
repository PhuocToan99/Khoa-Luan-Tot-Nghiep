import { Choice } from '../model/choice'
export class Quiz {
    quizId: Int32Array;
    question: string;
    questionType: string;
    image: string;
    imageLink: string;
    time: number;
    description: string;
    //quizCode:string;
    //questionCode:string;
    questionpoolId: string;
    //topicId: Int32Array;
    topicId: string;
    isInExamQuiz:boolean = false;
    choices: Array <Choice>;
}
// export class Exam {
//     quizId: Int32Array;
//     question: string;
//     questionType: string;
//     image;
//     imageLink;
//     time: number;
//     description: string;
//     //quizCode:string;
//     //questionCode:string;
//     questionpoolId: string;
//     //topicId: Int32Array;
//     topicId: string;
//     choices: Array <Choice>;
// }
