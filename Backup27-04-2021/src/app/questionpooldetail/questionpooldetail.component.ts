import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Params } from '@angular/router';
import { Quiz } from '../model/quiz';
import { QuizService } from '../services/quiz.service';
@Component({
  selector: 'app-questionpooldetail',
  templateUrl: './questionpooldetail.component.html',
  styleUrls: ['./questionpooldetail.component.css']
})
export class QuestionpooldetailComponent implements OnInit {
  id:any;
  quizlist: Quiz[] = [];
  constructor(private route: ActivatedRoute,private quizService: QuizService) {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
   }

  async ngOnInit(){
    await this.getQuizList(this.id);
  }
  async getQuizList(id){
    var result = await this.quizService.getQuizOfQuestionpool(id) as Quiz[];
    console.log(result);
    result.forEach((item, index) => {
      if (this.quizlist.findIndex(i => i.quizId == item.quizId) === -1) 
      {
          this.quizlist.push(item)
      }
  
  });
    console.log(this.quizlist);
  }
}
