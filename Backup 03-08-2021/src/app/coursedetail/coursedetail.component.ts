import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { Topic } from '../model/topic'
import { SubtopicService } from '../services/subtopic.service';
import { Params, Router } from '@angular/router';
import { Subtopic } from '../model/subtopic';
import { Lesson } from '../model/lesson';
import { LessonService } from '../services/lesson.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { CourseService } from '../services/course.service';
import { NgxY2PlayerOptions, NgxY2PlayerComponent } from 'ngx-y2-player';
import { Course } from '../model/course';
import {ActivatedRoute} from "@angular/router";
import { AccountincourseService } from '../services/accountincourse.service';
import { AccountInCourse } from '../model/accountincourse';
import { NotificationService } from '../services/notification.service';
import {MatDialog} from '@angular/material/dialog';
import { InvoicedialogComponent } from '../dialog/invoicedialog/invoicedialog.component';
import {CartService} from "../services/cart.service";
import { DatePipe } from '@angular/common';
import { interval, Subscription} from 'rxjs';
import { QuizvideodialogComponent } from '../dialog/quizvideodialog/quizvideodialog.component';
import { QuizInfoDialogDataAPI } from '../addcoursedetail/shared/dialogData';
export class VideoQuiz{
  question:string;
  answer1:string;
  answer2:string;
  answer3:string;
  answer4:string;
  isCorrect:string;
}
@Component({
  selector: 'app-coursedetail',
  templateUrl: './coursedetail.component.html',
  styleUrls: ['./coursedetail.component.css']
})
export class CoursedetailComponent implements OnInit {
  currentAccount: Account;
  public course:Course = new Course;
  public topicdataset: Topic[] = [];
  public subtopicdataset: Subtopic[] = [];
  public id;
  public videoUrls :string[] =[];
  public lessondataset: Lesson[] = [];
  public instructorFlag:boolean = false;
  @ViewChild(NgxY2PlayerComponent) video: NgxY2PlayerComponent;
  playerOptions: NgxY2PlayerOptions = {
    height: 'auto'
  }
  constructor(private topicservice: TopicService,private subtopicservice: SubtopicService,private lessonservice: LessonService,private authenticationService: AuthenticationService,
    private router: Router,private courseService : CourseService,private route: ActivatedRoute,private accountincourseService: AccountincourseService,private notificationService: NotificationService,
    private chRef: ChangeDetectorRef,public dialog: MatDialog, private datePipe: DatePipe,private cartService:CartService) { 
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
  }
  async ngOnInit(){
    await this.load();
    this.chRef.detectChanges();
  }
  public getsubtopics = async (id) =>{
    return this.subtopicdataset = await this.subtopicservice.getSubtopicsByTopicId(id) as Subtopic[];
  }
  
  public showdetail = async (id) =>{
    this.lessondataset = await this.lessonservice.getLessonsBySubtopicId(id) as Lesson[];
    this.videoUrls = [];
    for(let i = 0;i<this.lessondataset.length;i++){
      this.videoUrls.push(this.lessondataset[i].lessonContent);
    }
    console.log(this.videoUrls);
    return this.lessondataset;
  }
  bought;
  public load = async () =>{
    this.course = await this.courseService.getcourse(this.id) as Course;
    this.instructorFlag = (this.course.accountId == this.currentAccount.accountId) ? true : false;
    this.topicdataset = await this.topicservice.gettopicsbycourseid(this.id) as Topic[];
    this.subtopicdataset = await this.subtopicservice.getSubtopicsByCourseId(this.id) as Subtopic[];
    const courseAlreadeyBought = await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[];
    var result = courseAlreadeyBought.find(x => x.courseId == this.id);
    this.bought = (result == undefined || courseAlreadeyBought.length == 0) ? false : true;
    if(this.bought){
      this.lessondataset = await this.lessonservice.getalllessonbycourseids(this.id) as Lesson[];
    }
    else{
      this.lessondataset = await this.lessonservice.getalllessonbeforeboughtbycourseids(this.id) as Lesson[];
    }
    if(this.lessondataset){
         this.videoUrls.push(this.lessondataset[0].lessonContent); 
    }
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
        console.log(result);
        if(result.isInfo==false){
          this.addToCart(this.course);
          this.router.navigate(['cart']);
        }
      });
      }
    }
  }
  makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() *
        charactersLength)));
    }
    return result.join('');
  }
  buyFreeCourse(){
    var invoiceCode = this.makeid(6);
    var accountInCourse: AccountInCourse = new AccountInCourse();
    accountInCourse.accountId = this.currentAccount.accountId;
    accountInCourse.courseId = this.course.courseId;
    accountInCourse.isBought = true;
    accountInCourse.paymentMethod = "Account Balance";
    accountInCourse.invoiceCode = invoiceCode;
    accountInCourse.getPayment = false;
    accountInCourse.createdDate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    this.accountincourseService.postaccountincourse(accountInCourse);
    var instructorInCourse:AccountInCourse = new AccountInCourse();
    instructorInCourse.accountId = this.course.accountId;
    instructorInCourse.courseId = this.course.courseId;
    instructorInCourse.isBought = false;
    instructorInCourse.getPayment = true;
    instructorInCourse.paymentMethod = "Account Balance";
    instructorInCourse.invoiceCode = invoiceCode;
    instructorInCourse.createdDate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    this.accountincourseService.postaccountincourse(instructorInCourse);
    this.notificationService.showNotification("This course have been add to your course libary","Buy success",1500);
    this.router.navigateByUrl('mycourse'); 
  }
  async addToCart(course) {
      if(this.course.price != 0){
        this.cartService.addToCart({course,quantity:1});
      }
      else{
        this.buyFreeCourse();
      }
  };
  mySubscription: Subscription;
  async onStateChange(event,index){
    var id = this.lessondataset[index].lessonId;
    if(event.data == 1){
      var videoQuizData:QuizInfoDialogDataAPI[] = [];
      videoQuizData = await this.lessonservice.getVideoQuizInfo(id) as QuizInfoDialogDataAPI[];
      console.log(videoQuizData);
      this.mySubscription= interval(1000).subscribe((x =>{
        var stringTime = this.video.videoPlayer.getCurrentTime().toString();
          var time = parseInt(stringTime);
          var result = videoQuizData.find(e => e.time == time);
          if(result != undefined){
            let question = result.question;
            let answer1 = result.answer1;
            let answer2 = result.answer2;
            let answer3 = result.answer3;
            let answer4 = result.answer4;
            let isCorrect = result.isCorrect;
            this.video.videoPlayer.pauseVideo();
            this.mySubscription.unsubscribe();
            const dialogRef = this.dialog.open(QuizvideodialogComponent,{ width: '400px',
            data: {question: question, answer1: answer1,answer2: answer2,answer3: answer3,answer4:answer4,isCorrect:isCorrect}});
            dialogRef.afterClosed().subscribe(result => {
              this.video.videoPlayer.playVideo();
            });
          }      
    }));
    }
    //Ended or Paused video
    if(event.data == 0 || event.data == 2){
      this.mySubscription.unsubscribe();
      this.mySubscription.remove(this.mySubscription);
    }
  }
}
