import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Questionpool } from '../model/questionpool';
@Injectable({
  providedIn: 'root'
})
export class QuestionpoolService {
  private urlAPI = 'https://localhost:44387/api/Questionpools';
  constructor(private http: HttpClient) { }
  getquestionpools = async () => {
    try {
      return await this.http.get(this.urlAPI).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postquestionpool = async (questionpool: Questionpool) => {
    try 
    { 
      console.log(questionpool);
      var formData = new FormData();
      formData.append('questionType',questionpool.questionType);
      formData.append('question',questionpool.question);
      formData.append('time',questionpool.time.toString());
      formData.append('description',questionpool.description);
      formData.append('quizCode',questionpool.quizCode);
      formData.append('questionCode',questionpool.questionCode);
      formData.append('topicId',questionpool.topicId.toString());
      formData.append('quizId',questionpool.quizId.toString());
      if (questionpool.image)
      {
        formData.append('image', questionpool.image);
      }
      return await this.http.post(this.urlAPI, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletequestionpool = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatequiz = async (id, questionpool) => {
    try 
    {
      const formData: FormData = new FormData();
      formData.append('questionType',questionpool.questionType);
      formData.append('question',questionpool.question);
      formData.append('time',questionpool.time.toString());
      formData.append('description',questionpool.description);
      formData.append('quizCode',questionpool.quizCode);
      formData.append('questionCode',questionpool.questionCode);
      formData.append('topicId',questionpool.topicId.toString());
      formData.append('quizId',questionpool.quizId.toString());
      if (questionpool.image)
      {
        formData.append('image', questionpool.image);
      }
      console.log(formData);
      return await this.http.put(this.urlAPI + "/" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
