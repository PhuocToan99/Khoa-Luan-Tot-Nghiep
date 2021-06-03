import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lesson } from '../model/lesson';
@Injectable({
  providedIn: 'root'
})
export class LessonService {
  // private readonly urlAPILesson = 'https://localhost:44387/api/';
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  getlessons = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetLessonList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postlesson = async (lesson: Lesson) => {
    try {
      return await this.http.post(this.urlAPI+"AddLesson", lesson).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletelesson = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteLesson" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatelesson = async (id, lesson) => {
    try 
    {
      return await this.http.put(this.urlAPI + "EditLesson" + id,lesson).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getalllessonbycourseids = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"GetLesson/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getalllessonbeforeboughtbycourseids = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"GetLessonBeforeBought?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getLessonsBySubtopicId = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"GetLessonBySubtopic/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
