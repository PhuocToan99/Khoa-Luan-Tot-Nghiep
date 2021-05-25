import { Component, OnInit} from '@angular/core';
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
import { QuestionpoolService } from '../services/questionpool.service';
import { ExamQuiz } from '../model/examquiz';
import { ExamquizserviceService } from '../services/examquizservice.service';
import {MatDialog} from '@angular/material/dialog';
import { InvoicedialogComponent } from '../dialog/invoicedialog/invoicedialog.component';
@Component({
  selector: 'app-categorydetail',
  templateUrl: './categorydetail.component.html',
  styleUrls: ['./categorydetail.component.css']
})
export class CategorydetailComponent implements OnInit {
  public panelOpenState = false;
  public course:Course;
  quantity: number = 1;
  topics: Array<Topic>
  public dataset: Topic[]
  public TopicID: string = ''
  public TopicTitle: string = ''
  public SessionNumber: number = 0;
  public LastUpdate;
  public CourseId;
  public SubTopicID: string = '';
  public SubTopicTitle: string = '';
  public SubTopicNumber: number = 0;
  public LessonID : string ='';
  public LessonContent :string ='';
  public LessonTitle :string ='';
  public LessonNo: number = 0;
  isEdit: boolean;
  public CourseName: string;
  public Rating: number = 0.0;  
  public NumberOfVoters: number = 0.0; 
  public NumberOfParticipants: number = 0.0;
  public Price: number = 0.0;    
  public CourseHastag: string;
  public CourseLevel :string;
  public CourseDuration: string;
  public ThumbnailImage;
  public StartDate;
  public InstructorName : string ='';
  currentAccount: Account;
  public topicdata : Array<Topic>;
  public topicdataset: Topic[];
  public subtopicdataset: Subtopic[];
  public show : boolean = false;
  public id;
  public subtopicdata: Subtopic[];
  public accountincourse : AccountInCourse[];
  public bought: Boolean = false;
  public instructor: User;
  public Description :string[];
  questionpoolList:Questionpool[] = [];
  quizcount: number[] =[];
  examQuiz : ExamQuiz[] = [];
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
    private questionpoolService: QuestionpoolService, 
    private router: Router,
    private examQuizService:ExamquizserviceService,
    public dialog: MatDialog) { 
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
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
async addToCart() {
    var course = await this.courservice.getcourse(this.id) as Course;
    if(this.quantity) this.cartService.addToCart({course,quantity:1})
};

public loadimage(url){
  return this.imageLoadService.getImageSource(url);
}
public loadpage = async () =>{
  const course = await this.courservice.getcourse(this.id) as Course;
  this.CourseName = course.courseName;
  this.Rating = course.rating;
  this.NumberOfParticipants = course.numberOfParticipants;
  this.Price = course.price;
  this.StartDate = moment(course.startDate).format("DD/MM/YYYY");
  this.CourseDuration = course.courseDuration;
  this.Description = course.description ? course.description.split(".") : [];
  this.CourseHastag = course.hastag;
  this.CourseLevel = course.level;
  this.instructor = await this.userservice.getuser(this.currentAccount.userId) as User;
  this.topicdataset = await this.topicservice.gettopicsbycourseid(this.id) as Topic[];
  this.subtopicdata = await this.subtopicservice.getsubtopics() as Subtopic[];
  const courseAlreadeyBought = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
  for(let i=0;i < courseAlreadeyBought.length;i++){
    if(courseAlreadeyBought[i].accountId == this.currentAccount.accountId && courseAlreadeyBought[i].courseId == this.id)
    {
      this.bought = true;
    }
  } 
  this.questionpoolList = await this.questionpoolService.getQuestionpoolByContainId(this.id) as Questionpool[];
    if(this.questionpoolList){
     for(let i =0;i<this.questionpoolList.length;i++){
       let result = await this.questionpoolService.getNumberOfQuizInQuestionpool(this.questionpoolList[i].questionpoolId) as number;
       this.quizcount.push(result);
     }
    }
  }
public getsubtopics = async (id) =>{
  const list = await this.subtopicservice.getSubtopicsByTopicId(id) as Subtopic[];
  return this.subtopicdataset = list;
}
goToExam(id){
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
  if(this.examQuiz != null && this.examQuiz != undefined){
    var isActive = this.examQuiz[0].isBlocked ? true : false;
    this.quizIsActive.push(isActive);
    quizcode = this.examQuiz[0].examCode;
    this.quizCodeList.push(quizcode);
    var name = (this.examQuiz[0].examQuizName == "") ? "" : this.examQuiz[0].examQuizName;
    this.quizName.push(name);
    quizcount++;
    for(var i = 1;i< this.examQuiz.length ;i++){
      quizcount++;
      if(this.examQuiz[i].examCode != quizcode){
        this.quizCodeNumber.push(quizcount.toString());
        quizcount = 0;
        quizcount ++;
        quizcode = this.examQuiz[i].examCode;
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
  console.log(this.quizCodeNumber);
  console.log(this.quizIsActive);
}
historyshow = false;
displayedColumns: string[] = ['quizcode', 'iscomplete', 'result', 'lasttaken'];
dataSource;
async showHistory(quizCode){
  this.historyshow = !this.historyshow;
  this.dataSource = await this.examQuizService.getExamQuizHistory(quizCode) as AccountInCourse[];
}
buyalert(){
  const dialogRef = this.dialog.open(InvoicedialogComponent, {
    data: { isInfo: true }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    if(!result.isInfo){
      this.addToCart();
      this.router.navigate(['cart']);
    }
  });
}
}
