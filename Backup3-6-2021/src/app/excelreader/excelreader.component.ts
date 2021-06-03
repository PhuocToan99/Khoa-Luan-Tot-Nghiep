import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import * as XLSX from 'xlsx';
import { Questionpool } from '../model/questionpool';
import { Quiz } from '../model/quiz';
import { QuizService} from '../services/quiz.service';
import { Choice } from '../model/choice';
import { ChoiceService} from '../services/choice.service';
import {ExcelService} from '../services/excel.service';
import { QuestionpoolService} from '../services/questionpool.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { QuizdialogComponent } from '../dialog/quizdialog/quizdialog.component';
import { QuizDialogData } from '../dialog/shared/sharedata';
import { QuestionpooldialogComponent } from '../dialog/questionpooldialog/questionpooldialog.component';
import { User } from '../model/user';
import { ImageloadService } from '../services/imageload.service';
import { NotificationService } from '../services/notification.service';
import { Comment,SubComment } from '../model/comment';
import { Course } from '../model/course';
import { CommentService } from '../services/comment.service';
import { DatePipe } from '@angular/common';
import { RatingdialogComponent } from '../dialog/ratingdialog/ratingdialog.component';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { Account } from '../model/Account';
import { Router } from '@angular/router';
export class CommentData{
  comment:Comment;
  subCommentList:SubComment[];
  isEditComment:boolean;
  isDeleteComment:boolean;
  isEditSubComment:boolean = false;
  isDeleteSubComment:boolean;
  showComment:boolean;
  showSubComment:boolean;
}
@Component({
  selector: 'app-excelreader',
  templateUrl: './excelreader.component.html',
  styleUrls: ['./excelreader.component.css']
})
export class ExcelreaderComponent implements OnInit {
  public quizlist : Quiz[] = [];
  public Question ="";
  public Option1 ="";
  public Option2 ="";
  public Option3 ="";
  public Option4 ="";
  public Option5 ="";
  public isCorrect;
  public ImageOption1 = null;
  public ImageOption2 = null;
  public ImageOption3 = null;
  public ImageOption4 = null;
  public ImageOption5 = null;
  public ImageQuestion = null;
  public ImageURLOption1 ="";
  public ImageURLOption2 ="";
  public ImageURLOption3 ="";
  public ImageURLOption4 ="";
  public ImageURLOption5 ="";
  public ImageURLQuestion ="";
  public Description ="";
  public QuestionType="";
  public Time;
  public Tagtopic;
  public QuestionpoolList : Questionpool[] = [];
  public QuestionpoolId: string = '';
  public QuestionpoolName: string = '';
  public CreatedDate: Date;
  public LastEdited: Date;
  public QuestionpoolHastag:string ='';
  //public QuizCode: string='';
  public LessonId: string='';
  public QuestionpoolThumbnailImage;
  public LastUpdate;
  public CourseId = 1;
  data: [][];
  data1: [][];
  user:User = new User();



  public commentList:CommentData[] = [];
  public commentContent;
  public commentEditContent;
  public subCommentContent;
  // public reply:boolean;
  public indexEdit;
  public parentCommentId;
  public account;
  public isEdit:boolean;
  public isDelete:boolean;
  public isEditComment:boolean;
  // public isEditSubComment:boolean;
  // public subCommentIdEditDelete;
  // public commentIdEditDelete;
  commentEditDto:Comment;
  subCommentEditDto:SubComment;
  constructor(private excelService:ExcelService,private questionpoolService:QuestionpoolService,private quizService:QuizService,private choiceService:ChoiceService,public dialog: MatDialog
  ,private imageLoadService:ImageloadService,private notification:NotificationService,private datePipe:DatePipe,
  private commentService:CommentService,private courseService:CourseService, private userSErvice: UserService,private chRef: ChangeDetectorRef, private router: Router) {
    this.account = JSON.parse(localStorage.getItem('currentAccount'));
    
   }

  async ngOnInit() {
    this.user = (this.account != undefined || this.account != null) ? await this.userSErvice.getUserByAccountId(this.account.accountId) as User : undefined;
    await this.loadComment();
    console.log(this.commentList);
  }
  
  public loadimage(url){
    return this.imageLoadService.getImageSource(url);
  }
  
  rating;
  log(){
    console.log(this.rating);
  }
  description;
  // async savecomment(option,id){
  //   var course = await this.courseService.getcourses() as Course[];
  //   // var account = await this.userSErvice.getaccounts() as Account[];
  //   var account = JSON.parse(localStorage.getItem('currentAccount'));
  //   var user = await this.userSErvice.getUserByAccountId(account.accountId) as User;
  //   if(option){
  //     var comment = new Comment();
  //     comment.commentContent = this.ckeditorContent;
  //     comment.datePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
  //     comment.type = "Comment";
  //     comment.userId = user.userId;
  //     comment.likeCount = 0;
  //     comment.isLiked = false;
  //     comment.courseId = course[0].courseId;
  //     await this.commentService.postComment(comment);
  //   }
  //   else{
  //     var subComment = new SubComment();
  //     subComment.userId = user.userId;
  //     subComment.parentCommentId = id;
  //     subComment.subCommentContent = this.ckeditorContent;
  //     subComment.subDatePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
  //     subComment.isLiked = false;
  //     subComment.likeCount = 0;
  //     await this.commentService.postSubComment(subComment);
  //   }
  //   await this.loadComment();
  //   this.chRef.detectChanges();
  // }
 
  async loadComment(){
    this.commentList = [];
    var course = await this.courseService.getcourses() as Course[];
    var result = await this.commentService.getCommentByCourseId(course[0].courseId) as Comment[];
    if(result != null && result != undefined){
      result.forEach(async e =>{
        var data:CommentData = new CommentData();
        e.datePost = this.datePipe.transform(Date.now(),'dd-MM-yyyy hh:mm:ss');
        data.comment = e;
        var listSubCommentList = await this.commentService.getSubCommentByCommentId(e.commentId) as SubComment[];
        data.subCommentList = (listSubCommentList.length > 0) ? listSubCommentList : [];
        data.isEditComment = (this.user.userId == e.userId) ? true : false;
        data.isDeleteComment = (this.user.userId == e.userId) ? true : false;
        data.showComment = false;
        data.showSubComment = false;
        if(data.subCommentList.length > 0){
          data.subCommentList.forEach(u => {u.subDatePost = this.datePipe.transform(Date.now(),'dd-MM-yyyy hh:mm:ss'),
          data.isEditSubComment = (this.user.userId == u.userId) ? true : false;
          data.isDeleteSubComment = (this.user.userId == u.userId) ? true : false;
        });
        }
        this.commentList.push(data);
      });
      return this.commentList;
    }
    return this.commentList;
  }
  async onSubmit(){
    if(this.account == null || this.account == undefined){
      this.router.navigate(['login']);
    }
    var course = await this.courseService.getcourses() as Course[];
    // var account = await this.userSErvice.getaccounts() as Account[];
    if(this.commentContent || this.commentEditContent){
      var comment = new Comment();
      comment.commentContent = this.commentContent;
      comment.datePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      comment.type = "Comment";
      comment.userId = this.user.userId;
      comment.likeCount = 0;
      comment.isLiked = false;
      comment.courseId = course[0].courseId;
      if(this.commentEditDto && this.commentEditDto.commentId != undefined){
        this.commentEditDto.commentContent = this.commentEditContent;
        this.commentEditDto.user = null;
        this.commentEditDto.datePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
        console.log(this.commentEditDto);
       await this.commentService.updateComment(this.commentEditDto);
      }
      else{
        await this.commentService.postComment(comment);
      }
      this.commentEditDto = null;
    }
    if(this.subCommentContent){
      var subComment = new SubComment();
      subComment.userId = this.user.userId;
      subComment.parentCommentId = this.subCommentEditDto.parentCommentId;
      subComment.subCommentContent = this.subCommentContent;
      subComment.subDatePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      subComment.isLiked = false;
      subComment.likeCount = 0;
      if(this.subCommentEditDto && this.subCommentEditDto.subCommentId != undefined){
        this.subCommentEditDto.subCommentContent = this.subCommentContent;
        this.subCommentEditDto.user = null;
        this.subCommentEditDto.subDatePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
       await this.commentService.updateSubComment(this.subCommentEditDto);
      }
      else{
        await this.commentService.postSubComment(subComment);
      }  
      this.subCommentEditDto = null;
    }
    this.commentContent = "";
    this.subCommentContent = "";
    this.commentList[this.indexEdit].showSubComment = !this.commentList[this.indexEdit].showSubComment;
    this.commentList[this.indexEdit].showComment = !this.commentList[this.indexEdit].showComment;
    this.indexEdit = null;
    await this.loadComment();
    this.chRef.detectChanges();
  }
  changeCommentState(id,i){
    if(this.account == null || this.account == undefined){
      this.router.navigate(['login']);
    }
    // this.parentCommentId = id;
    this.isEditComment = false;
    this.commentList[i].showComment = !this.commentList[i].showComment;
    var subComment = new SubComment();
    subComment.parentCommentId = id;
    subComment.subCommentContent = "";
    this.subCommentEditDto = subComment;
    this.chRef.detectChanges();
  }
  editSubComment(subComment:SubComment,i){
    this.commentList[i].showSubComment = !this.commentList[i].showSubComment;
    this.indexEdit = i;
    this.subCommentContent = subComment.subCommentContent;
    this.subCommentEditDto = subComment;
    this.chRef.detectChanges();
  }
  editComment(comment:Comment,i){
    this.commentList[i].showComment = !this.commentList[i].showComment;
    this.isEditComment = true;
    this.indexEdit = i;
    this.commentEditContent = comment.commentContent;
    this.commentEditDto = comment;
    console.log(this.isEditComment +" "+this.commentEditDto);
    this.chRef.detectChanges();
  }
  async deleteComment(id,type){
    console.log(id,type);
    var r = confirm("Do you want to delete this "+type+"?");
    if(r){
    var result = (type =="comment") ? await this.commentService.deleteComment(id) : await this.commentService.deleteSubComment(id);
    this.loadComment();
    this.chRef.detectChanges();
    }
  }
}
