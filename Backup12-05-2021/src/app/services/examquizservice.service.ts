import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExamquizserviceService {
  quizExam = []
  constructor() { }
  addToQuizExam(quizExam){
    this.quizExam.push(quizExam);
    console.log(this.quizExam);
  }
  addQuizExam(){
    this.quizExam =[];
  }
}
