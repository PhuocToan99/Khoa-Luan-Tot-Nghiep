import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../model/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  getQuizs = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetQuizList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getQuiz = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"GetQuiz"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postQuiz = async (quiz: Quiz) => {
    console.log(quiz.image);
    try 
    { 
      var image:string = quiz.image;
      var imageLink:string = quiz.imageLink;
      var formData = new FormData();
      formData.append('questionType',quiz.questionType);
      formData.append('question',quiz.question);
      formData.append('time',quiz.time.toString());
      formData.append('description',quiz.description);
      formData.append('topicId',quiz.topicId);
      formData.append('questionpoolId',quiz.questionpoolId.toString());
      if (quiz.imageLink)
      {
        formData.append('quizImageLink', imageLink);
      }
      if (quiz.image)
      {
        formData.append('quizImage', image);
      }
      //  //Log FormData
      // for (var pair of formData.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]); 
      // }
      return await this.http.post(this.urlAPI+"AddQuiz", formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteQuiz = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteQuizs" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updateQuiz = async (id, quiz) => {
    try 
    { 
      var image:string = quiz.image;
      var imageLink:string = quiz.imageLink;
      const formData: FormData = new FormData();
      formData.append('quizId',quiz.quizId.toString());
      formData.append('questionType',quiz.questionType);
      formData.append('question',quiz.question);
      formData.append('time',quiz.time.toString());
      formData.append('description',quiz.description);
      formData.append('topicId',quiz.topicId.toString());
      formData.append('questionpoolId',quiz.questionpoolId.toString());
      if (quiz.imageLink)
      {
        formData.append('quizImageLink', imageLink);
      }
      if (quiz.image)
      {
        formData.append('quizImage', image);
      }
      return await this.http.put(this.urlAPI + "EditQuiz" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getLastQuizs = async () => {
    try {
      return await this.http.get(this.urlAPI+"LastQuiz").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }  
  getQuizCount = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"QuizOfQuestionpoolCounts/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getQuizOfQuestionpool = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"QuizOfQuestionpool/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getQuizsOfInstructor = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"QuizOfInstructor?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
