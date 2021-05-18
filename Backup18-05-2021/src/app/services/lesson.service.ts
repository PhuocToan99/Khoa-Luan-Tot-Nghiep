import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lesson } from '../model/lesson';
@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private readonly urlAPILesson = 'https://localhost:44387/api/';
  constructor(private http: HttpClient) { }
  getlessons = async () => {
    try {
      return await this.http.get(this.urlAPILesson+"GetLessonList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postlesson = async (lesson: Lesson) => {
    try {
      return await this.http.post(this.urlAPILesson+"AddLesson", lesson).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletelesson = async (id) =>{
    try {
      return await this.http.delete(this.urlAPILesson + "DeleteLesson" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatelesson = async (id, lesson) => {
    try 
    {
      return await this.http.put(this.urlAPILesson + "EditLesson" + id,lesson).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getalllessonbycourseids = async (id) => {
    try {
      return await this.http.get(this.urlAPILesson+"GetLesson/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getLessonsBySubtopicId = async (id) => {
    try {
      return await this.http.get(this.urlAPILesson+"GetLessonBySubtopic/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
