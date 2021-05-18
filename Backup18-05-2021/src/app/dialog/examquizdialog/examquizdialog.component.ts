import { Component, OnInit,Inject } from '@angular/core';
import { ExamQuizListDialogData } from '../shared/sharedata';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ExamquizserviceService } from '../../services/examquizservice.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-examquizdialog',
  templateUrl: './examquizdialog.component.html',
  styleUrls: ['./examquizdialog.component.css']
})
export class ExamquizdialogComponent implements OnInit {
  examQuizName:string = "";
  isLocked: boolean = false;
  constructor(public dialogRef: MatDialogRef<ExamquizdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExamQuizListDialogData,private examQuizService:ExamquizserviceService,private notificationService:NotificationService) { 
      if(data.examQuizList.length > 0){
        this.examQuizName = (this.data.examQuizList[0].examQuizName == "") ? "" : this.data.examQuizList[0].examQuizName;
        this.isLocked = this.data.examQuizList[0].isBlocked;
        console.log(this.isLocked);
      }
    }

  ngOnInit(): void {
  }
  save(){
    this.data.isSave = true;
    this.data.examQuizList.forEach(e => e.examQuizName = this.examQuizName);
    console.log(this.isLocked);
    this.data.examQuizList.forEach(e => e.isBlocked = this.isLocked);
    console.log(this.data.examQuizList);
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
    //console.log(event.target.checked+" "+account);
    if(event.target.checked == false){
      this.notificationService.showNotification("This examquiz have been unblock","Unlock examquiz",3000); 
      return this.isLocked = false;
    }
    if(event.target.checked == true){
      this.notificationService.showDeleteNotification("This examquiz have been block","Block examquiz",3000);
      return this.isLocked = true;
    }
  }
}
