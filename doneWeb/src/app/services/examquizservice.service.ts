import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExamQuiz } from '../model/examquiz';
@Injectable({
  providedIn: 'root'
})
export class ExamquizserviceService {
  private readonly urlAPI = 'http://localhost:5001/api/';
  quizExam : ExamQuiz[] = [];
  qns: any[];
  seconds: number;
  timer;
  qnProgress: number;
  correctAnswerCount: number = 0;
  constructor(private http: HttpClient) { }
  addToQuizExam(quizExam){
    this.quizExam.push(quizExam);
  }
  removeFromQuizExam(id){
    var index = this.quizExam.findIndex( element => element.quizId == id );
    if(index != -1){
      this.quizExam.splice(index,1);
    }
  }
  async getExamQuizAttempByAccountId(id){
    try {
      return await this.http.get(this.urlAPI+"GetExamQuizAttempByAccountId?accountId="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getExamByCourseId(id){
    try {
      return await this.http.get(this.urlAPI+"GetExamQuizListOrderByExamCode?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getExamByExamCode(examCode){
    try {
      return await this.http.get(this.urlAPI+"GetExamQuizListByExamCode?examcode="+examCode).toPromise();
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
        this.quizExam.forEach(async element => {
          if(element.examQuizId == undefined){
            element.isBlocked = element.isBlocked;
            await this.http.post(this.urlAPI+"AddExamQuiz", element).toPromise();
          }
          if(element.examQuizId != undefined){
            element.isBlocked = element.isBlocked;
            await this.updateExamQuiz(element);
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
      return await this.http.get(this.urlAPI+"GetExamQuizHistory?quizCode="+examCode).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async updateExamQuiz(examquiz:ExamQuiz){
    try {
      return await this.http.put(this.urlAPI+"EditExamQuiz"+examquiz.examQuizId,examquiz).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async updateExamQuizState(examQuizCode){
    try {
      var examQuiz:ExamQuiz = new ExamQuiz();
      return await this.http.put(this.urlAPI+"ChangeExamquizState?examQuizCode="+examQuizCode,examQuiz).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getFinalExamQuizList(examCode,courseId){
    try {
      return await this.http.get(this.urlAPI+"GetFinalExamQuizList?examCode="+examCode+"&courseId="+courseId).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
