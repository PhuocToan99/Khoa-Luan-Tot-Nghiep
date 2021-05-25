import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountInCourse } from '../model/accountincourse';
@Injectable({
  providedIn: 'root'
})
export class AccountincourseService {
  private readonly urlAPI = 'https://localhost:44387/api/';
  constructor(private http: HttpClient) { }
  getaccountincourses = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetAccountInCoursesList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getaccountincoursesByAccountId = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"GetAccountInCoursesByAccountid?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postaccountincourse = async (accountincourse: AccountInCourse) => {
    try {
      return await this.http.post(this.urlAPI+"AddAccountInCourse", accountincourse).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteaccountincourse = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteAccountInCourse" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
