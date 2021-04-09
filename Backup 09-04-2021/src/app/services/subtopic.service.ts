import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subtopic } from '../model/subtopic';

@Injectable({
  providedIn: 'root'
})
export class SubtopicService {
  private urlAPISubtopic = 'https://localhost:44387/api/SubTopics';
  constructor(private http: HttpClient) { }
  getsubtopics = async () => {
    try {
      return await this.http.get(this.urlAPISubtopic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getsubtopiccount = async(id) =>{
    try 
    {
      const subtopic = await this.http.get(this.urlAPISubtopic + "/Counts/" + id).toPromise();
      return subtopic;
    }
    catch (e) {
      console.log(e);
    }
  }
  postsubtopic = async (subtopic: Subtopic) => {
    try {
      return await this.http.post(this.urlAPISubtopic, subtopic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletesubtopic = async (id) =>{
    try {
      return await this.http.delete(this.urlAPISubtopic + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatesubtopic = async (id, subtopic) => {
    try 
    {
      return await this.http.put(this.urlAPISubtopic + "/" + id,subtopic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
