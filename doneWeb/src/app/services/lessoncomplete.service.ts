import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LessonComplete } from '../model/lessoncomplete';
@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  getlessoncompletes = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetLessonCompleteList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postlessoncomplete = async (lessonComplete: LessonComplete) => {
    try {
        return await this.http.post(this.urlAPI+"AddLessonComplete", lessonComplete).toPromise();
      }
      catch (e) {
        console.log(e);
      }
    }
  deletelessoncomplte = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteLessonComplete" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatelessoncomplete = async (id, lessoncomplete) => {
    try 
    {
      return await this.http.put(this.urlAPI + "EditLessonComplete" + id,lessoncomplete).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
