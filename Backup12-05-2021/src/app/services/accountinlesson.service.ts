import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AccountinlessonService {
  private readonly urlAPI = 'https://localhost:44387/api/';
  constructor(private http: HttpClient) { }
  getaccountinlessons = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetAccountinLessonList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postaccountincourse = async (accountincourse) => {
    try {
      return await this.http.post(this.urlAPI+"AddAccountinLesson", accountincourse).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
