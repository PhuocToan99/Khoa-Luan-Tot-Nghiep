import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Topic } from '../model/topic';
@Injectable({
  providedIn: 'root'
})
export class TopicService {
  // private readonly urlAPI = 'https://localhost:44387/api/';
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  gettopics = async () => {
    try {
      return await this.http.get(this.urlAPI +"GetTopicList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  gettopic = async(id) =>{
    try 
    {
      return await this.http.get(this.urlAPI + "GetTopic" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  gettopiccount = async(id) =>{
    try 
    {
      return await this.http.get(this.urlAPI + "CountTopics/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  gettopicsbycourseid = async (id) => {
    try {
      return await this.http.get(this.urlAPI+"GetTopicByCourseId/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }

  posttopic = async (topic: Topic) => {
    try {
      return await this.http.post(this.urlAPI+"AddTopic", topic).toPromise();
    }
    catch (e) {
      console.log(e);
    }  
  }
  deletetopic = async(id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteTopic" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatetopic = async (id, topic) => {
    try 
    {
      return await this.http.put(this.urlAPI + "EditTopic" + id,topic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
