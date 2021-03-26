import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountInCourse } from '../model/accountincourse';
@Injectable({
  providedIn: 'root'
})
export class AccountincourseService {
  private urlAPI = 'https://localhost:44387/api/AccountinCourses';
  constructor(private http: HttpClient) { }
  getaccountincourses = async () => {
    try {
      return await this.http.get(this.urlAPI).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postaccountincourse = async (accountincourse: AccountInCourse) => {
    try {
      return await this.http.post(this.urlAPI, accountincourse).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteaccountincourse = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
