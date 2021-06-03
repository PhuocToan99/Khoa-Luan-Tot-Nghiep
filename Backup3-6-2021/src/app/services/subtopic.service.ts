import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subtopic } from '../model/subtopic';

@Injectable({
  providedIn: 'root'
})
export class SubtopicService {
  // private readonly urlAPISubtopic = 'https://localhost:44387/api/';
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  getsubtopics = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetSubtopicList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getsubtopiccount = async(id) =>{
    try 
    {
      const subtopic = await this.http.get(this.urlAPI + "SubtopicCounts/" + id).toPromise();
      return subtopic;
    }
    catch (e) {
      console.log(e);
    }
  }
  getSubtopicsByTopicId = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"GetSubtopicByTopic/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  getSubtopicsByCourseId = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"GetSubtopic/"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postsubtopic = async (subtopic: Subtopic) => {
    try {
      return await this.http.post(this.urlAPI+"AddSubtopic", subtopic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletesubtopic = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteSubtopic" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatesubtopic = async (id, subtopic) => {
    try 
    {
      return await this.http.put(this.urlAPI + "EditSubtopic" + id,subtopic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
