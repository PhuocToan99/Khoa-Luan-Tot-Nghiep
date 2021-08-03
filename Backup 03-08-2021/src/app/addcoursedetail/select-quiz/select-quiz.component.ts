import { Component, OnInit,Inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { QuizInfoDialogData, VideoQuizTime } from '../shared/dialogData';
import { Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-select-quiz',
  templateUrl: './select-quiz.component.html',
  styleUrls: ['./select-quiz.component.css']
})
export class SelectQuizComponent implements OnInit {
  accountId:string = "";
  quizInfoList:QuizInfoDialogData[] = [];
  isInExamQuiz:boolean[] = [];
  constructor(private quizService:QuizService, private router: Router,@Inject(MAT_DIALOG_DATA) public data: VideoQuizTime,
  private dialogRef: MatDialogRef<SelectQuizComponent>) {
    this.accountId = localStorage.getItem("accountId");
    this.isInExamQuiz.forEach(e => e = false);
    console.log(this.accountId);
    this.loadpage();
  }
  async ngOnInit(){}
  async loadpage(){
    this.quizInfoList = await this.quizService.getQuizsOfInstructor(this.accountId) as QuizInfoDialogData[];
    console.log(this.quizInfoList);
    return;
  }
  toManagePage(){
    this.data.quizId="Noquiz";
    this.dialogRef.close();
    this.router.navigate(['/managequestionpool']);
  }
  nosave(){
    this.data = null;
  }
  showOptions(event:any,quiz:QuizInfoDialogData,index): void {
    console.log(event);
    if(event == true){
      console.log(quiz);
      for(let i = 0;i< this.isInExamQuiz.length;i++){
        this.isInExamQuiz[i] = (i == index) ? true : false;
        this.data.quizId = quiz.quizID;
      }
    }
  }
}
