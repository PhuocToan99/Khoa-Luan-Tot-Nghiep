import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Choice } from '../model/choice';
@Injectable({
  providedIn: 'root'
})
export class ChoiceService {
  private readonly urlAPI = 'https://localhost:44387/api/';
  constructor(private http: HttpClient) { }
  getchoices = async () => {
    try {
      return await this.http.get(this.urlAPI+"GetChoiceList").toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  postchoice = async (choice: Choice) => {
    try 
    { 
      var image:string = choice.image;
      var imageLink:string = choice.imageLink;
      var formData = new FormData();
      formData.append('answer',choice.answer);
      formData.append('isCorrect',choice.isCorrect.toString());
      formData.append('questionCode',choice.questionCode);
      formData.append('quizId',choice.quizId.toString());
      if (choice.imageLink)
      {
        formData.append('answerImageLink', imageLink);
      }
      if (choice.image)
      {
        formData.append('answerImage',image);
      }
      return await this.http.post(this.urlAPI+"AddChoice", formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  deletechoice = async (id) =>{
    try {
      return await this.http.delete(this.urlAPI + "DeleteChoice" + id).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
  updatechoice = async (id, choice) => {
    try 
    {
      var image:string = choice.image;
      var imageLink:string = choice.imageLink;
      const formData: FormData = new FormData();
      formData.append('choiceId',choice.choiceId);
      formData.append('answer',choice.answer);
      formData.append('isCorrect',choice.isCorrect.toString());
      formData.append('questionCode',choice.questionCode);
      formData.append('quizId',choice.quizId.toString());
      if (choice.imageLink)
      {
        formData.append('answerImageLink', imageLink);
      }
      if (choice.image)
      {
        formData.append('answerImage', image);
      }
      console.log(formData);
      return await this.http.put(this.urlAPI + "EditChoice" + id, formData).toPromise();
    }
    catch (e) {
      console.log(e);
    }
  }
}
