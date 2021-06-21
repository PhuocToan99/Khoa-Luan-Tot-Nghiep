import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../model/course';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // private readonly urlAPICourse = 'https://localhost:44387/api/';
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  getcourses = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetCourseList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getallcourses = async () => {
    try {
      return await this.http.get(this.urlAPI+"AllCourses").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getcourse = async(id) =>{
    try 
    {
      const course = await this.http.get(this.urlAPI + "GetCourse" + id).toPromise();
      return course;
    }
    catch (e) {
      console.log(e);
    }
  }
  getCourseByAccountId = async(id) =>{
    try 
    {
      const course = await this.http.get(this.urlAPI + "GetCoursesWithAccountId?id=" + id).toPromise();
      return course;
    }
    catch (e) {
      console.log(e);
    }
  }
  gettopcourse = async() =>{
    try 
    {
      const course = await this.http.get(this.urlAPI + "TopCourses").toPromise();
      return course;
    }
    catch (e) {
      console.log(e);
    }
  }
  async getTop6CourseBase(option){
    try 
    {
      const course = await this.http.get(this.urlAPI + "GetTop6CourseDesktop?option="+option).toPromise();
      return course;
    }
    catch (e) {
      console.log(e);
    }
  }
  postcourse = async (course: Course) => {
    try 
    { 
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
      formData.append('lessonNumber',course.lessonNumber.toString());
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
      return await this.http.post(this.urlAPI+"AddCourse", formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletecourses = async(id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteCourse" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatecourses = async (course) => {
    try 
    {
      const formData: FormData = new FormData();
      formData.append('courseId',course.courseId);
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
      formData.append('isActive',course.isActive);
      if (course.thumbnailImage)
      {
        formData.append('thumbnailImage', course.thumbnailImage);
      }
      formData.append('accountId',course.accountId);
      console.log(formData);
       //Log FormData
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
      return await this.http.put(this.urlAPI + "EditCourse" + course.courseId, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async updatecourseviewcount(id,course){
    try 
    {
      return await this.http.put(this.urlAPI + "ViewCount?id=" + id,course).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getCourseSearch(name,option,accountId){
    try 
    {
      return await this.http.get(this.urlAPI + "SearchCourse?name="+name+"&option="+option+"&accountId="+accountId).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getCourseFilter(hastag,courseName,maxPrice,level){
    try 
    {
      var urlString = this.urlAPI + "FilterCourse?hastag="+hastag+"&courseName="+courseName+"&maxPrice="+maxPrice+"&minPrice=0"+"&level="+level;
      console.log(urlString);
      return await this.http.get(urlString).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getInstructorCourse(accountId){
    try 
    {
      return await this.http.get(this.urlAPI + "GetInstructorFeatureCourse?id="+accountId).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
