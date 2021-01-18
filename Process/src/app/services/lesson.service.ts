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
  // getlessoncount = async(id) =>{
  //   try 
  //   {
  //     const lesson = await this.http.get(this.urlAPILesson + "/Counts/" + id).toPromise();
  //     return lesson;
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }
  postlesson = async (lesson: Lesson) => {
    try {
      return await this.http.post(this.urlAPILesson, lesson).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletesubtopic = async (id) =>{
    try {
      return await this.http.delete(this.urlAPILesson + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
