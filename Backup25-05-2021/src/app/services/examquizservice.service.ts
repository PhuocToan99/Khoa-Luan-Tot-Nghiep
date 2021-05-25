import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExamQuiz } from '../model/examquiz';
@Injectable({
  providedIn: 'root'
})
export class ExamquizserviceService {
  private readonly APIUrl="https://localhost:44387/api/";
  quizExam : ExamQuiz[] = [];
  qns: any[];
  seconds: number;
  timer;
  qnProgress: number;
  correctAnswerCount: number = 0;
  constructor(private http: HttpClient) { }
  addToQuizExam(quizExam){
    this.quizExam.push(quizExam);
    console.log(this.quizExam);
  }
  removeFromQuizExam(id){
    console.log(id);
    var index = this.quizExam.findIndex( element => element.quizId == id );
    if(index != -1){
      this.quizExam.splice(index,1);
    }
  }
  async getExamByCourseId(id){
    try {
      return await this.http.get(this.APIUrl+"GetExamQuizListOrderByExamCode?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getExamByExamCode(examCode){
    try {
      return await this.http.get(this.APIUrl+"GetExamQuizListByExamCode?examcode="+examCode).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async postQuizExam() {
    console.log(this.quizExam);
    try 
    { 
      if(this.quizExam.length > 0){
        this.quizExam.forEach(element => {
          if(element.examQuizId == undefined){
            element.isBlocked = element.isBlocked;
            console.log(element);
            var result = this.http.post(this.APIUrl+"AddExamQuiz", element).toPromise();
            console.log(result);
          }
          if(element.examQuizId != undefined){
            element.isBlocked = element.isBlocked;
            console.log(element);
            var result = this.updateExamQuiz(element);
            console.log(result);
          }
        }
        )
      };
      this.quizExam = [];
    }
    catch (e) {
      console.log(e);
    }
  }
  displayTimeElapsed() {
    return Math.floor(this.seconds / 3600) + ':' + Math.floor(this.seconds / 60) + ':' + Math.floor(this.seconds % 60);
  }
  async getExamQuizHistory(examCode){
    try {
      return await this.http.get(this.APIUrl+"GetExamQuizHistory?quizCode="+examCode).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async updateExamQuiz(examquiz:ExamQuiz){
    try {
      return await this.http.put(this.APIUrl+"EditExamQuiz"+examquiz.examQuizId,examquiz).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
