import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subtopic } from '../model/subtopic';

@Injectable({
  providedIn: 'root'
})
export class SubtopicService {
  private readonly urlAPISubtopic = 'https://localhost:44387/api/';
  constructor(private http: HttpClient) { }
  getsubtopics = async () => {
    try {
      return await this.http.get(this.urlAPISubtopic+"GetSubtopicList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getsubtopiccount = async(id) =>{
    try 
    {
      const subtopic = await this.http.get(this.urlAPISubtopic + "SubtopicCounts/" + id).toPromise();
      return subtopic;
    }
    catch (e) {
      console.log(e);
    }
  }
  getSubtopicsByTopicId = async (id) => {
    try {
      return await this.http.get(this.urlAPISubtopic+"GetSubtopicByTopic/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getSubtopicsByCourseId = async (id) => {
    try {
      return await this.http.get(this.urlAPISubtopic+"GetSubtopic/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postsubtopic = async (subtopic: Subtopic) => {
    try {
      return await this.http.post(this.urlAPISubtopic+"AddSubtopic", subtopic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletesubtopic = async (id) =>{
    try {
      return await this.http.delete(this.urlAPISubtopic + "DeleteSubtopic" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatesubtopic = async (id, subtopic) => {
    try 
    {
      return await this.http.put(this.urlAPISubtopic + "EditSubtopic" + id,subtopic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
