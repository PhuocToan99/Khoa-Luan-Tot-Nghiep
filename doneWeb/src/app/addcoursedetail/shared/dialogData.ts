export class QuizInfoDialogData{
    quizID:string;
    question:string;
    answer1:string;
    answer2:string;
    answer3:string;
    answer4:string;
    isCorrect:number;
}
export class VideoQuizTime{
    id:number;
    quizId:string;
    time:string;
    videoDuration:number;
    lessonId:number;
}
export class QuizInfoDialogDataAPI{
    quizID:string;
    question:string;
    answer1:string;
    answer2:string;
    answer3:string;
    answer4:string;
    isCorrect:number;
    time:number;
}