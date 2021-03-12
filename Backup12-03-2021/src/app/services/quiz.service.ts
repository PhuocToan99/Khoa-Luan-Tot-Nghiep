import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../model/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private urlAPI = 'https://localhost:44387/api/Quizs';
  constructor(private http: HttpClient) { }
  getQuizs = async () => {
    try {
      return await this.http.get(this.urlAPI).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getQuiz = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postQuiz = async (quiz: Quiz) => {
    console.log(quiz.image);
    try 
    { 
      var formData = new FormData();
      formData.append('questionType',quiz.questionType);
      formData.append('question',quiz.question);
      formData.append('time',quiz.time.toString());
      formData.append('description',quiz.description);
      //formData.append('quizCode',quiz.quizCode);
      //formData.append('questionCode',quiz.questionCode);
      formData.append('topicId',quiz.topicId.toString());
      formData.append('questionpoolId',quiz.questionpoolId.toString());
      if (quiz.image)
      {
        formData.append('image', quiz.image);
      }
      if(quiz.image == undefined){
        formData.append('image', null);
      }
       //Log FormData
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
      return await this.http.post(this.urlAPI, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteQuiz = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updateQuiz = async (id, quiz) => {
    try 
    {
      const formData: FormData = new FormData();
      formData.append('questionType',quiz.questionType);
      formData.append('question',quiz.question);
      formData.append('time',quiz.time.toString());
      formData.append('description',quiz.description);
      //formData.append('quizCode',questionpool.quizCode);
      //formData.append('questionCode',questionpool.questionCode);
      formData.append('topicId',quiz.topicId.toString());
      formData.append('questionpoolId',quiz.questionpoolId.toString());
      if (quiz.image)
      {
        formData.append('image', quiz.image);
      }
      console.log(formData);
      return await this.http.put(this.urlAPI + "/" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getLastQuizs = async () => {
    try {
      return await this.http.get(this.urlAPI+"/Last").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
