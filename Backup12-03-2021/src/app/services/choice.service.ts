import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Choice } from '../model/choice';
@Injectable({
  providedIn: 'root'
})
export class ChoiceService {
  private urlAPI = 'https://localhost:44387/api/Choices';
  constructor(private http: HttpClient) { }
  getchoices = async () => {
    try {
      return await this.http.get(this.urlAPI).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postchoice = async (choice: Choice) => {
    try 
    { 
      var formData = new FormData();
      formData.append('answer',choice.answer);
      formData.append('isCorrect',choice.isCorrect.toString());
      formData.append('questionCode',choice.questionCode);
      formData.append('quizId',choice.quizId.toString());
      if (choice.image)
      {
        formData.append('image', choice.image);
      }
      return await this.http.post(this.urlAPI, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletechoice = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "/" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatechoice = async (id, choice) => {
    try 
    {
      const formData: FormData = new FormData();
      formData.append('answer',choice.answer);
      formData.append('isCorrect',choice.isCorrect.toString());
      formData.append('questionCode',choice.questionCode);
      formData.append('quizId',choice.quizId.toString());
      if (choice.image)
      {
        formData.append('image', choice.image);
      }
      console.log(formData);
      return await this.http.put(this.urlAPI + "/" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
