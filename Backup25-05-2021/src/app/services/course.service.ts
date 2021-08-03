import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../model/course';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly urlAPICourse = 'https://localhost:44387/api/';
  constructor(private http: HttpClient) { }
  getcourses = async () => {
    try {
      return await this.http.get(this.urlAPICourse+"GetCourseList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getallcourses = async () => {
    try {
      return await this.http.get(this.urlAPICourse+"AllCourses").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getcourse = async(id) =>{
    try 
    {
      const course = await this.http.get(this.urlAPICourse + "GetCourse" + id).toPromise();
      return course;
    }
    catch (e) {
      console.log(e);
    }
  }
  getCourseByAccountId = async(id) =>{
    try 
    {
      const course = await this.http.get(this.urlAPICourse + "GetCoursesWithAccountId" + id).toPromise();
      return course;
    }
    catch (e) {
      console.log(e);
    }
  }
  gettopcourse = async() =>{
    try 
    {
      const course = await this.http.get(this.urlAPICourse + "TopCourses").toPromise();
      return course;
    }
    catch (e) {
      console.log(e);
    }
  }
  postcourse = async (course: Course) => {
    try 
    { 
      // const httpOptions = {
      //   headers: new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'})
      // };
      //console.log(user);
      var formData = new FormData();
      formData.append('courseName',course.courseName);
      formData.append('rating',course.rating.toString());
      formData.append('numberOfVoters',course.numberOfVoters.toString());
      formData.append('numberOfParticipants',course.numberOfParticipants.toString());
      formData.append('startDate',course.startDate.toString());
      formData.append('lastUpdate',course.lastUpdate.toString());
      formData.append('price',course.price.toString());
      formData.append('courseDuration',course.courseDuration);
      formData.append('description',course.description);
      formData.append('hastag',course.hastag);
      formData.append('level',course.level);
      formData.append('lessonNumber',course.lessonNumbers.toString());
      formData.append('isActive',course.isActive.toString());
      if (course.thumbnailImage)
      {
        formData.append('thumbnaiImage', course.thumbnailImage);
      }
      formData.append('accountId',course.accountId.toString());
      //Log FormData
      /*for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }*/
      // return await this.http.post(loginUrl, formData,httpOptions).toPromise();
      return await this.http.post(this.urlAPICourse+"AddCourse", formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletecourses = async(id) =>{
    try {
      return await this.http.delete(this.urlAPICourse + "DeleteCourse" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatecourses = async (id, course) => {
    try 
    {
      console.log(course);
      console.log(course.thumbnailImage);
      const formData: FormData = new FormData();
      course.startDate = moment(course.startDate).format("MM/DD/YYYY");
      course.lastUpdate = moment(course.lastUpdate).format("MM/DD/YYYY");
      formData.append('courseId',id);
      formData.append('courseName',course.courseName);
      formData.append('rating',course.rating.toString());
      formData.append('numberOfVoters',course.numberOfVoters.toString());
      formData.append('numberOfParticipants',course.numberOfParticipants.toString());
      formData.append('startDate',course.startDate.toString());
      formData.append('lastUpdate',course.lastUpdate.toString());
      formData.append('price',course.price.toString());
      formData.append('courseDuration',course.courseDuration);
      formData.append('description',course.description);
      formData.append('hastag',course.hastag);
      formData.append('level',course.level);
      formData.append('lessonNumber',course.lessonNumber.toString());
      formData.append('isActive',course.isActive.toString());
      if (course.thumbnailImage)
      {
        formData.append('thumbnailImage', course.thumbnailImage);
      }
      formData.append('accountId',course.accountId);
      //console.log(course.courseName+" "+course.rating.toString()+" "+course.numberOfVoters.toString()+" "+course.numberOfParticipants.toString()+" "+course.startDate.toString()+" "+course.lastUpdate.toString()+" "+course.price.toString()+course.courseDuration);
      console.log(formData);
       //Log FormData
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
      return await this.http.put(this.urlAPICourse + "EditCourse" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  
}