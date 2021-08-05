import { Component, OnInit,Inject } from '@angular/core';
import { ExamQuizListDialogData } from '../shared/sharedata';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ExamquizserviceService } from '../../services/examquizservice.service';
import { NotificationService } from '../../services/notification.service';
import { ExamQuiz } from '../../model/examquiz';
@Component({
  selector: 'app-examquizdialog',
  templateUrl: './examquizdialog.component.html',
  styleUrls: ['./examquizdialog.component.css']
})
export class ExamquizdialogComponent implements OnInit {
  examQuizName:string = "";
  isLocked: boolean = false;
  isFinalQuiz: boolean = false;
  examQuizListFinal: ExamQuiz[] = [];
  constructor(public dialogRef: MatDialogRef<ExamquizdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExamQuizListDialogData,private examQuizService:ExamquizserviceService,private notificationService:NotificationService) { 
      if(data.examQuizList.length > 0){
        this.examQuizName = (this.data.examQuizList[0].examQuizName == "" || this.data.examQuizList[0].examQuizName == undefined || this.data.examQuizList[0].examQuizName == null) ? "My Quiz" : this.data.examQuizList[0].examQuizName;
        this.isLocked = this.data.examQuizList[0].isBlocked;
        console.log(this.isLocked);
      }
    }

  ngOnInit(): void {
  }
  save(){
    this.data.isSave = true;
    this.data.examQuizList.forEach(e => {e.examQuizName = this.examQuizName,
    e.isFinalQuiz = this.isFinalQuiz,
    e.isBlocked = this.isLocked
    });
  }
  nosave(){
    this.data.isSave = false;
    this.data.examQuizList.forEach(e => e.examQuizName = this.examQuizName);
    this.data.examQuizList.forEach(e => e.isBlocked = this.isLocked);
  }
  deleteExamQuiz(id){
    this.examQuizService.removeFromQuizExam(id);
    this.data.examQuizList = this.examQuizService.quizExam;
  }
  checkCheckBoxvalue(event){
    if(event.target.checked == false){
      this.notificationService.showNotification("This examquiz have been unblock","Unlock examquiz",3000); 
      return this.isLocked = false;
    }
    if(event.target.checked == true){
      this.notificationService.showDeleteNotification("This examquiz have been block","Block examquiz",3000);
      return this.isLocked = true;
    }
  }

  async showOptions(e){
    if(e == true){
      this.examQuizListFinal = await this.examQuizService.getFinalExamQuizList(this.data.examQuizList[0].examQuizCode,this.data.examQuizList[0].courseId) as ExamQuiz[];
      if(this.examQuizListFinal.length > 0){
        var r = confirm("There already have final quiz. Do you want to change this examquiz as a final quiz? If yes we update your quiz,if no we will set this quiz as normal quiz");
      if(r){
        this.data.isSave = true;
        this.examQuizListFinal.forEach(async e =>{
          e.isFinalQuiz = false;
          await this.examQuizService.updateExamQuiz(e);
        });
        this.data.examQuizList.forEach(e => {
          e.examQuizName = this.examQuizName,
          e.isBlocked = this.isLocked,
          e.isFinalQuiz = true
        });
        this.isFinalQuiz = true;
        console.log(this.data.examQuizList);
      }
      else{
        this.isFinalQuiz = false
      }
      } 
    }
  }
}
