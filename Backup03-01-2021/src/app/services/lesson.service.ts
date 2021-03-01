import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lesson } from '../model/lesson';
@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private urlAPILesson = 'https://localhost:44387/api/Lessons';
  constructor(private http: HttpClient) { }
  getlessons = async () => {
    try {
      return await this.http.get(this.urlAPILesson).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postlesson = async (lesson: Lesson) => {
    try {
      return await this.http.post(this.urlAPILesson, lesson).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletelesson = async (id) =>{
    try {
      return await this.http.delete(this.urlAPILesson + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatelesson = async (id, lesson) => {
    try 
    {
      return await this.http.put(this.urlAPILesson + "/" + id,lesson).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getalllessonbycourseids = async (id) => {
    try {
      return await this.http.get(this.urlAPILesson+"/GetLesson/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
