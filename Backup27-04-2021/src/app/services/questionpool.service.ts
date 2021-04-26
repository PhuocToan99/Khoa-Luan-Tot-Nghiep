import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Questionpool } from '../model/questionpool';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class QuestionpoolService {
  private urlAPI = 'https://localhost:44387/api/Questionpools';
  constructor(private http: HttpClient) { }
  getQuestionpools = async () => {
    try {
      return await this.http.get(this.urlAPI).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getInstructorInfo = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"/getInstructor/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postQuestionpool = async (questionpool: Questionpool) => {
    try 
    { 
      var formData = new FormData();
      // quiz.createdDate = moment(quiz.createdDate).format("MM/DD/YYYY");
      // quiz.lastEdited = moment(quiz.lastEdited).format("MM/DD/YYYY");
      console.log(questionpool);
      formData.append('questionpoolName',questionpool.questionpoolName);
      formData.append('createdDate',(questionpool.createdDate).toString());
      formData.append('lastEdited',(questionpool.lastEdited).toString());
      formData.append('hastag',questionpool.hastag);
      //formData.append('quizCode',quiz.quizCode);
      formData.append('courseId',questionpool.courseId.toString());
      formData.append('lessonId',questionpool.lessonId.toString());
      formData.append('isActive',questionpool.isActive.toString());
      if (questionpool.thumbnailImageURL != "")
      {
        formData.append('thumbnailImageURL', questionpool.thumbnailImage);
      }
      if(questionpool.thumbnailImage == ""){
        formData.append('thumbnailImageURL', null);
      }
      if (questionpool.thumbnailImage)
      {
        formData.append('thumbnailImage', questionpool.thumbnailImage);
      }
      if(questionpool.thumbnailImage == undefined){
        formData.append('thumbnailImage', null);
      }
      return await this.http.post(this.urlAPI, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteQuestionpool = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updateQuestionpool = async (id, questionpool) => {
    console.log(questionpool);
    try 
    {
      const formData: FormData = new FormData();
      questionpool.createdDate = moment(questionpool.createdDate).format("MM/DD/YYYY");
      questionpool.lastEdited = moment(questionpool.lastEdited).format("MM/DD/YYYY");
      formData.append('questionpoolId',questionpool.questionpoolId);
      formData.append('questionpoolName',questionpool.questionpoolName);
      formData.append('createdDate',questionpool.createdDate);
      formData.append('lastEdited',questionpool.lastEdited);
      formData.append('hastag',questionpool.hastag);
      //formData.append('quizCode',quiz.quizCode);
      formData.append('courseId',questionpool.courseId.toString());
      formData.append('lessonId',questionpool.lessonId.toString());
      formData.append('isActive',questionpool.isActive.toString());
      if (questionpool.thumbnailImageURL != "")
      {
        formData.append('thumbnailImageURL', questionpool.thumbnailImage);
      }
      if(questionpool.thumbnailImage == ""){
        formData.append('thumbnailImageURL', null);
      }
      if (questionpool.thumbnailImage)
      {
        formData.append('thumbnailImage', questionpool.thumbnailImage);
      }
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
      return await this.http.put(this.urlAPI + "/" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
