import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../services/cart.service";
import { Course } from '../model/course';
import { TopicService } from '../services/topic.service';
import { Topic } from '../model/topic';
import { DatePipe } from '@angular/common';
import { SubtopicService } from '../services/subtopic.service';
import { Subtopic } from '../model/subtopic';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { Params,Router } from '@angular/router';
import * as moment from 'moment';
import { User } from '../model/user';
import { ImageloadService } from '../services/imageload.service';
import { Questionpool } from '../model/questionpool';
import { ExamQuiz } from '../model/examquiz';
import { ExamquizserviceService } from '../services/examquizservice.service';
import {MatDialog} from '@angular/material/dialog';
import { InvoicedialogComponent } from '../dialog/invoicedialog/invoicedialog.component';
import { Comment,SubComment } from '../model/comment';
import { CommentService } from '../services/comment.service';
import { NotificationService } from '../services/notification.service';
import { AccountInLesson } from '../model/accountinlesson';
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
export class ExamQuizHistory{
    accountinLesson: AccountInLesson;
    username: string;
    passedResult:string;
}
@Component({
  selector: 'app-categorydetail',
  templateUrl: './categorydetail.component.html',
  styleUrls: ['./categorydetail.component.css']
})
export class CategorydetailComponent implements OnInit {
  public panelOpenState = false;
  public course:Course = new Course;
  quantity: number = 1;
  topics: Array<Topic>
  public dataset: Topic[]
  public LastUpdate;
  isEdit: boolean;
  public StartDate;
  currentAccount: Account;
  public topicdata : Array<Topic>;
  public topicdataset: Topic[];
  public subtopicdataset: Subtopic[];
  public show : boolean = false;
  public id;
  public subtopicdata: Subtopic[];
  public accountincourse : AccountInCourse[];
  public bought: Boolean = false;
  public instructor: User = new User;
  questionpoolList:Questionpool[] = [];
  quizcount: number[] =[];
  examQuiz : ExamQuiz[] = [];
  public islogin;
  public commentList:CommentData[] = [];
  public commentContent;
  public commentEditContent;
  public subCommentContent;
  public indexEdit;
  public parentCommentId;
  public user:User;
  public isCommentEdit:boolean;
  public isDelete:boolean;
  public isEditComment:boolean;
  commentEditDto:Comment;
  subCommentEditDto:SubComment;
  constructor(private route: ActivatedRoute,
    private cartService:CartService,
    private topicservice: TopicService,
    private datePipe: DatePipe,
    private subtopicservice: SubtopicService,
    private authenticationService: AuthenticationService,
    private activatedroute:ActivatedRoute,
    private courservice:CourseService,
    private userservice: UserService,
    private accountincourseService: AccountincourseService,
    private imageLoadService:ImageloadService,
    private router: Router,
    private examQuizService:ExamquizserviceService,private notificationService: NotificationService,
    public dialog: MatDialog,private chRef: ChangeDetectorRef,private commentService:CommentService) { 
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      this.islogin = (this.currentAccount != null || this.currentAccount != undefined) ? true : false;
    this.LastUpdate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    this.id=this.activatedroute.snapshot.paramMap.get("id");
    }

  async ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );  
    await this.loadpage();
    await this.getExamList();
  }
changeQuantity = (newQuantity:number) => {
    this.quantity = newQuantity;
};
async addToCart(course) {
    if(!this.islogin){
      this.router.navigate(['login']);
    }
    else{
      if(this.course.price != 0 && this.currentAccount.accountId != this.course.accountId){
        this.cartService.addToCart({course,quantity:1});
      }
      if(this.course.price == 0 && this.currentAccount.accountId != this.course.accountId){
        this.buyFreeCourse();
      }
    }
};

public loadimage(url){
  return this.imageLoadService.getImageSource(url);
}
public loadpage = async () =>{
  this.course = await this.courservice.getcourse(this.id) as Course;
  this.StartDate = moment(this.course.startDate).format("DD/MM/YYYY");
  this.course.lessonNumber = (this.course.lessonNumber == null || this.course.lessonNumber == undefined || this.course.lessonNumber == 0) ? 0 : this.course.lessonNumber;
  this.instructor = await this.userservice.getUserByAccountId(this.course.accountId) as User;
  this.topicdataset = await this.topicservice.gettopicsbycourseid(this.id) as Topic[];
  this.subtopicdata = await this.subtopicservice.getsubtopics() as Subtopic[];
  this.user = (this.currentAccount != undefined && this.currentAccount != null) ? await this.userservice.getUserByAccountId(this.currentAccount.accountId) as User : undefined;
  const courseAlreadeyBought = (this.currentAccount) ? await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[] : [];
  if(this.currentAccount == undefined || this.currentAccount == null || courseAlreadeyBought.length == 0){
    this.bought = false;
  }
  else{
    this.bought = (courseAlreadeyBought.find(e => e.courseId == this.id) == undefined && this.currentAccount.accountId != this.course.accountId) ? false : true;
  }
  await this.loadComment();
  }
public getsubtopics = async (id) =>{
  const list = await this.subtopicservice.getSubtopicsByTopicId(id) as Subtopic[];
  return this.subtopicdataset = list;
}
goToExam(id){
  console.log(id);
  localStorage.setItem("courseId",this.id);
  localStorage.setItem("quizCode",id);
  this.router.navigate(['exam/'+id]);
}
quizCodeList: string[] = [];
quizCodeNumber:string[] = [];
quizIsActive:boolean[] = [];
quizName:string[] = [];
async getExamList(){
  var quizcode = "";
  var quizcount = 0;
  this.examQuiz = await this.examQuizService.getExamByCourseId(this.id) as ExamQuiz[];
  console.log(this.examQuiz);
  if(this.examQuiz.length == 0){
    return;
  }
  if(this.bought){
  if(this.examQuiz != null && this.examQuiz != undefined){
    quizcode = this.examQuiz[0].examQuizCode;
    this.quizCodeList.push(quizcode);
    var name = (this.examQuiz[0].examQuizName == "") ? "" : this.examQuiz[0].examQuizName;
    this.quizName.push(name);
    quizcount++;
    for(var i = 1;i< this.examQuiz.length ;i++){
      quizcount++;
      if(this.examQuiz[i].examQuizCode != quizcode){
        this.quizCodeNumber.push(quizcount.toString());
        quizcount = 0;
        quizcount ++;
        quizcode = this.examQuiz[i].examQuizCode;
        this.quizCodeList.push(quizcode);
        name = (this.examQuiz[i].examQuizName == "") ? "" : this.examQuiz[i].examQuizName;
        this.quizName.push(name);
      }
    }
  }
  console.log(this.quizCodeList);
  this.quizCodeNumber.push(quizcount.toString());
  }
  else{
    if(this.examQuiz != null && this.examQuiz != undefined){
      var isActive = this.examQuiz[0].isBlocked ? true : false;
      this.quizIsActive.push(isActive);
      quizcode = this.examQuiz[0].examQuizCode;
      this.quizCodeList.push(quizcode);
      var name = (this.examQuiz[0].examQuizName == "") ? "" : this.examQuiz[0].examQuizName;
      this.quizName.push(name);
      quizcount++;
      for(var i = 1;i< this.examQuiz.length ;i++){
        quizcount++;
        if(this.examQuiz[i].examQuizCode != quizcode){
          this.quizCodeNumber.push(quizcount.toString());
          quizcount = 0;
          quizcount ++;
          quizcode = this.examQuiz[i].examQuizCode;
          this.quizCodeList.push(quizcode);
          isActive =  isActive = this.examQuiz[i].isBlocked ? true : false;
          name = (this.examQuiz[i].examQuizName == "") ? "" : this.examQuiz[i].examQuizName;
          this.quizName.push(name);
          this.quizIsActive.push(isActive);
        }
      }
    }
    this.quizCodeNumber.push(quizcount.toString());
    console.log(this.quizCodeList);
    console.log(this.quizName);
  }
}
historyshow = false;
displayedColumns: string[] = ['examquizcode','accountname', 'passedresult', 'result', 'lasttaken'];
dataSource;
data: ExamQuizHistory[] = [];
async showHistory(quizCode){
  this.historyshow = !this.historyshow;
  this.dataSource = [];
  this.dataSource = await this.examQuizService.getExamQuizHistory(quizCode) as ExamQuizHistory[];
  console.log(this.dataSource);
  this.dataSource.forEach(e => {
    e.accountinLesson.lastTaken = this.datePipe.transform(e.accountinLesson.lastTaken, 'hh:mm:ss dd-MM-yyyy');
    e.passedResult = (e.accountinLesson.isCompleted) ? "Passed" :"Failed";
  });
}
buyalert(){
  var r = confirm("Do you want to buy this course to unlock all feature?")
  if(r){
    if(this.course.price == 0){
     this.buyFreeCourse(); 
    }
    else{
    const dialogRef = this.dialog.open(InvoicedialogComponent, {
      data: { isInfo: true,currentAccount: this.currentAccount }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result.isInfo == false){
        this.addToCart(this.course);
        this.router.navigate(['cart']);
      }
    });
    }
  }
}
async loadComment(){
  var result = await this.commentService.getCommentByCourseId(this.id) as Comment[];
  this.commentList = [];
  if(result != null && result != undefined){
    result.forEach(async e =>{
      var data:CommentData = new CommentData();
      e.datePost = this.datePipe.transform(Date.now(),'dd-MM-yyyy hh:mm:ss');
      data.comment = e;
      var listSubCommentList = await this.commentService.getSubCommentByCommentId(e.commentId) as SubComment[];
      data.subCommentList = (listSubCommentList.length > 0) ? listSubCommentList : [];
      if(this.user != undefined){
      data.isEditComment = (this.user.userId == e.userId) ? true : false;
      data.isDeleteComment = (this.user.userId == e.userId) ? true : false;
      }
      else{
        data.isEditComment = false;
        data.isDeleteComment = false;
      }
      data.showComment = false;
      data.showSubComment = false;
      if(data.subCommentList.length > 0){
        data.subCommentList.forEach(u => {u.subDatePost = this.datePipe.transform(Date.now(),'dd-MM-yyyy hh:mm:ss');
        if(this.user != undefined){
        data.isEditSubComment = (this.user.userId == u.userId && this.user != undefined) ? true : false;
        data.isDeleteSubComment = (this.user.userId == u.userId && this.user != undefined) ? true : false;
        }
        else{
          data.isEditSubComment = false;
          data.isDeleteSubComment = false;
        }
      });
      }
      this.commentList.push(data);
    });
    return this.commentList;
  }
  console.log(this.commentList);
  return this.commentList;
}
async onSubmit(){
  if(!this.islogin){
    this.router.navigate(['login']);
  }
  if(this.commentContent || this.commentEditContent){
    var comment = new Comment();
    comment.commentContent = this.commentContent;
    comment.datePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    comment.type = "Comment";
    comment.userId = this.user.userId;
    comment.likeCount = 0;
    comment.isLiked = false;
    comment.courseId = this.id;
    if(this.commentEditDto && this.commentEditDto.commentId != undefined){
      this.commentEditDto.commentContent = this.commentEditContent;
      this.commentEditDto.user = null;
      this.commentEditDto.datePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
     await this.commentService.updateComment(this.commentEditDto);
    }
    else{
      await this.commentService.postComment(comment);
    }
    this.commentEditDto = null;
    this.commentContent = "";
    if(this.indexEdit){
    this.commentList[this.indexEdit].showComment = (this.commentList[this.indexEdit].showComment) ? !this.commentList[this.indexEdit].showComment :this.commentList[this.indexEdit].showComment;
    }
    this.indexEdit = null;
    await this.loadComment();
    this.chRef.detectChanges();
    return;
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
    this.subCommentContent = "";
    this.isEditComment = (this.isEditComment) ? !this.isEditComment : this.isEditComment;
    if(this.indexEdit){
      this.commentList[this.indexEdit].showSubComment = (this.commentList[this.indexEdit].showSubComment) ? !this.commentList[this.indexEdit].showSubComment : this.commentList[this.indexEdit].showSubComment;
    }
    this.indexEdit = null;
    await this.loadComment();
    this.chRef.detectChanges();
    return;
  }
}
changeCommentState(id,i,type){
  if(!this.islogin){
    this.router.navigate(['login']);
  }
  this.isEditComment = false;
  this.commentList[i].showComment = (type == "repcomment") ? !this.commentList[i].showComment : this.commentList[i].showComment;
  this.commentList[i].showSubComment = (type == "repsubcomment") ? !this.commentList[i].showSubComment : this.commentList[i].showSubComment;
  this.indexEdit = i;
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
  this.chRef.detectChanges();
}
async deleteComment(id,type){
  var r = confirm("Do you want to delete this "+type+"?");
  if(r){
  var result = (type =="comment") ? await this.commentService.deleteComment(id) : await this.commentService.deleteSubComment(id);
  this.loadComment();
  this.chRef.detectChanges();
  }
}
async buyFreeCourse(){
  var invoiceCode = "";
  invoiceCode =  await this.accountincourseService.createInvoice(this.currentAccount.accountId,this.course.courseId,true,"Account Balance",invoiceCode,false,this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss'));
  await this.accountincourseService.createInvoice(this.course.accountId,this.course.courseId,false,"Account Balance",invoiceCode,true,this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss'));
  this.notificationService.showNotification("This course have been add to your course libary","Buy success",1500);
  this.router.navigateByUrl('invoicehistory'); 
}
toInstructorPage(id){
  this.router.navigate(['/profile'], {queryParams: {id: id,isInstructor : true}});
}
}
