import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Topic } from '../model/topic';
@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private urlAPI = 'https://localhost:44387/api/Topics';
  constructor(private http: HttpClient) { }
  gettopics = async () => {
    try {
      return await this.http.get(this.urlAPI).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }

  gettopic = async(id) =>{
    try 
    {
      const topic = await this.http.get(this.urlAPI + "/" + id).toPromise();
      return topic;
    }
    catch (e) {
      console.log(e);
    }
  }
  gettopiccount = async(id) =>{
    try 
    {
      const topic = await this.http.get(this.urlAPI + "/Counts/" + id).toPromise();
      return topic;
    }
    catch (e) {
      console.log(e);
    }
  }
  posttopic = async (topic: Topic) => {
    try {
      return await this.http.post(this.urlAPI, topic).toPromise();
    }
    catch (e) {
      console.log(e);
    }  
  }
  deletetopic = async(id) =>{
    try {
      return await this.http.delete(this.urlAPI + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatetopic = async (id, topic) => {
    try 
    {
      return await this.http.put(this.urlAPI + "/" + id,topic).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
