import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Questionpool } from '../model/questionpool';
import { QuestionpoolService } from '../services/questionpool.service';
import { QuestionpooldialogComponent } from '../dialog/questionpooldialog/questionpooldialog.component';
import { Lesson } from '../model/lesson';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AlertComponent } from './alert/alert.component';
export interface DialogData {
  type:string;
  confirm:string;
}
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
  AccountId;
  namesearch="";
  hastag="";
  dateSort="";
  show:boolean = false;
  public questionpoolhastags = ['C', 'C#', 'C++', 'Java','Html/css','Python','IOS/Android','AI','Javascript','Machine Learning','UX/UI','Framework','Orther'];
  questionpoolList:Questionpool[] = [];
  constructor(private datePipe: DatePipe,public dialog: MatDialog,private questionpoolService: QuestionpoolService, 
    private router: Router,private notificationService: NotificationService, private chRef: ChangeDetectorRef) { 
    this.CreatedDate = this.LastUpdate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    let courseInfo = JSON.parse(localStorage.getItem("course"));
    this.CourseId = parseInt(courseInfo.courseId);
    this.AccountId =localStorage.getItem("accountId");
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
      newQuestionpool.questionpoolName = questionpool.questionpoolName;
      newQuestionpool.isActive = true;
      newQuestionpool.questionpoolThumbnailImage = null;
      const result: any = await this.questionpoolService.postQuestionpool(newQuestionpool);
      if(result != null){
        this.notificationService.showNotification("Questionpool "+newQuestionpool.questionpoolName+" created success","Create success",3000);
      }
      else{
        this.notificationService.showDeleteNotification("Your questionpool created fail because all ready have questionpool name "+newQuestionpool.questionpoolName+".Please choose another name","Create fail",3000);
      }
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
    this.questionpoolList = await this.questionpoolService.getQuestionpoolByContainId(this.AccountId) as Questionpool[];
  }
  goToQuestionpooldetail(id){
    this.router.navigate(['questionpooldetail/'+id]);
  }
  goToExamPage(){
    this.router.navigate(['createexam']);
  }
  async deactiveQuestionpool(questionpool){
    // await this.questionpoolService.deactiveQuestionpool(questionpool);
    // var r = confirm("Do you want to unblock questionpool "+questionpool.questionpoolName+" ?");
    // if(r){
    //   questionpool.isActive = !questionpool.isActive;
    //   this.notificationService.showNotification("Active questionpool "+questionpool.questionpoolName+" success","Active success",3000);
    //   this.chRef.detectChanges();
    // }
    var confirmType;
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        type:"delete",confirm: confirmType
      }});
    dialogRef.afterClosed().subscribe(async result => {
      console.log(result.confirm);
      switch(result.confirm){
        case "delete":
          await this.questionpoolService.deleteQuestionpool(questionpool.questionpoolId);
          this.notificationService.showNotification("Delete questionpool "+questionpool.questionpoolName+" success","Delete success",3000);
          break;
        case "active":
          await this.questionpoolService.deactiveQuestionpool(questionpool);
          // questionpool.isActive = !questionpool.isActive;
          this.notificationService.showNotification("Active questionpool "+questionpool.questionpoolName+" success","Active success",3000);
          break;
      }
      await this.load();
      this.chRef.detectChanges();
    });
  }
  onChange(value,type){
    console.log(value);
    switch(type) { 
      case 'name': { 
         this.namesearch = value;
         break; 
      } 
      case 'hastag': { 
        this.hastag = value; 
         break; 
      } 
      default: { 
         this.dateSort = value; 
         break; 
      } 
   }
   this.dateSort = (this.dateSort !="") ? this.dateSort : "1";
  }
  updateState(check:boolean){
    this.show = (check) ? true :false;
    if(!check){
      this.load();
      this.chRef.detectChanges();
    }
  }
  async filter(){
    var questionpoolHastag = "";
    questionpoolHastag = (this.hastag) ? this.questionpoolhastags.indexOf(this.hastag).toString() : "";
    var result = await this.questionpoolService.filterQuestionpool(this.dateSort,questionpoolHastag,this.namesearch) as Questionpool[];
    if(result.length > 0){
      this.questionpoolList = result;
      this.chRef.detectChanges();
    }
    else{
      const dialogRef = this.dialog.open(AlertComponent);
      dialogRef.afterClosed().subscribe(async result => {
        await this.load();
        this.chRef.detectChanges();
      });
    }
  }
}
