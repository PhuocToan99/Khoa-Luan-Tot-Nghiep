import { Component, OnInit } from '@angular/core';
import { Questionpool } from '../model/questionpool';
import { QuestionpoolService } from '../services/questionpool.service';
import { QuestionpooldialogComponent } from '../dialog/questionpooldialog/questionpooldialog.component';
import { Lesson } from '../model/lesson';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-questionpoolmanagepage',
  templateUrl: './questionpoolmanagepage.component.html',
  styleUrls: ['./questionpoolmanagepage.component.css']
})
export class QuestionpoolmanagepageComponent implements OnInit {
  lessondataset: Lesson[] = [];
  QuestionpoolId: string = '';
  QuestionpoolName: string = '';
  CreatedDate;
  QuestionpoolHastag:string ='';
  //public QuizCode: string='';
  LessonId: string='';
  QuestionpoolThumbnailImage;
  LastUpdate;
  CourseId;
  questionpoolList:Questionpool[] = [];
  constructor(private datePipe: DatePipe,public dialog: MatDialog,private questionpoolService: QuestionpoolService, private router: Router,private notificationService: NotificationService) { 
    this.CreatedDate = this.LastUpdate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    let courseInfo = JSON.parse(localStorage.getItem("course"));
    this.CourseId = parseInt(courseInfo.courseId);
  }

  async ngOnInit(){
    this.load();
  }
   openQuestionpoolDialog(): void {
    console.log(this.lessondataset);
    const dialogRef = this.dialog.open(QuestionpooldialogComponent, {
      width: '500px',
      height: '600px',
      data: {questionpoolName: this.QuestionpoolName,createdDate: this.CreatedDate,lastEdited: this.LastUpdate,hastag:this.QuestionpoolHastag,thumbnailImage: this.QuestionpoolThumbnailImage,lessonId: this.LessonId,courseId:this.CourseId }
    });
    dialogRef.afterClosed().subscribe(result => {
      result.createdDate = this.LastUpdate;
      console.log(result);
      this.createNewQuestionpool(result);
    });
  }
  public createNewQuestionpool = async (questionpool) => {
    try {
      let newQuestionpool = new Questionpool();
      newQuestionpool.courseId = questionpool.courseId;
      newQuestionpool.createdDate = questionpool.createdDate;
      newQuestionpool.lastEdited = questionpool.createdDate;
      newQuestionpool.hastag = questionpool.hastag;
      newQuestionpool.accountId = localStorage.getItem("accountId");
      //quiznew.quizCode = quiz.quizCode;
      newQuestionpool.questionpoolName = questionpool.questionpoolName;
      newQuestionpool.isActive = true;
      newQuestionpool.questionpoolThumbnailImage = null;
      const result: any = await this.questionpoolService.postQuestionpool(newQuestionpool);
      console.log(result);
      this.notificationService.showNotification("Questionpool "+newQuestionpool.questionpoolName+" created success","Create success",3000);
      this.load();
    }
    catch (e) {
      this.notificationService.showDeleteNotification("Your questionpool created fail. Please try again","Create fail",3000);
    }
  };
  back(){
    this.router.navigate(['addcoursedetail']);
  }
  async load(){
    this.questionpoolList = await this.questionpoolService.getQuestionpoolByContainId(this.CourseId) as Questionpool[];
  }
  goToQuestionpooldetail(id){
    this.router.navigate(['questionpooldetail/'+id]);
  }
  goToExamPage(){
    this.router.navigate(['createexam']);
  }
}
