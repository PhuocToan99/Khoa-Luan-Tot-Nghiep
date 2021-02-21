import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../model/quiz';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private urlAPIQuiz = 'https://localhost:44387/api/Quizs';
  constructor(private http: HttpClient) { }
  getquizs = async () => {
    try {
      return await this.http.get(this.urlAPIQuiz).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postquiz = async (quiz: Quiz) => {
    try 
    { 
      var formData = new FormData();
      var createdDate = moment(quiz.createdDate).format("MM/DD/YYYY");
      var lastEdited = moment(quiz.lastEdited).format("MM/DD/YYYY");
      formData.append('quizName',quiz.quizName);
      formData.append('createdDate',createdDate);
      formData.append('lastEdited',lastEdited);
      formData.append('hastag',quiz.hastag);
      formData.append('quizCode',quiz.quizCode);
      formData.append('lessonId',quiz.lessonId.toString());
    
      if (quiz.thumbnailImage)
      {
        formData.append('thumbnailImage', quiz.thumbnailImage);
      }
      return await this.http.post(this.urlAPIQuiz, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletequiz = async (id) =>{
    try {
      return await this.http.delete(this.urlAPIQuiz + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatequiz = async (id, quiz) => {
    try 
    {
      const formData: FormData = new FormData();
      quiz.createdDate = moment(quiz.createdDate).format("MM/DD/YYYY");
      quiz.lastEdited = moment(quiz.lastEdited).format("MM/DD/YYYY");
      formData.append('quizName',quiz.quizName);
      formData.append('createdDate',quiz.createdDate);
      formData.append('lastEdited',quiz.lastEdited);
      formData.append('hastag',quiz.hastag);
      formData.append('quizCode',quiz.quizCode);
      formData.append('lessonId',quiz.lessonId.toString());
      if (quiz.thumbnailImage)
      {
        formData.append('thumbnailImage', quiz.thumbnailImage);
      }
      console.log(formData);
      return await this.http.put(this.urlAPIQuiz + "/" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
