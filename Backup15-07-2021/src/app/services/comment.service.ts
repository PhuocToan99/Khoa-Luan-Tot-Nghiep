import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly urlAPI = 'http://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  async getComments() {
    try {
      return await this.http.get(this.urlAPI+"GetCommentList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getComment(id) {
    try {
      return await this.http.get(this.urlAPI+"GetComment"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getCommentByCourseId(id) {
    try {
      return await this.http.get(this.urlAPI+"GetCommentListByCourseId?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getRatingByCourseId(id) {
    try {
      return await this.http.get(this.urlAPI+"GetRatingListByCourseId?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getSubComments() {
    try {
      return await this.http.get(this.urlAPI+"GetSubCommentList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getSubComment(id) {
    try {
      return await this.http.get(this.urlAPI+"GetSubComment"+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async getSubCommentByCommentId(id) {
    try {
      return await this.http.get(this.urlAPI+"GetSubCommentListByParentId?id="+id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async postComment (comment) {
    try 
    { 
      return await this.http.post(this.urlAPI+"AddComment", comment).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async postSubComment (subcomment) {
    try 
    { 
      return await this.http.post(this.urlAPI+"AddSubComment", subcomment).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async updateComment(comment) {
    try 
    {
      return await this.http.put(this.urlAPI + "EditComment" + comment.commentId, comment).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  async updateSubComment(subcomment) {
    try 
    {
      return await this.http.put(this.urlAPI + "EditSubComment" + subcomment.subCommentId, subcomment).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteComment = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteComment" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deleteSubComment = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteSubComment" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
