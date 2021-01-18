import { Component, OnInit, ViewChild } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { Topic } from '../model/topic'
import { DatePipe } from '@angular/common';
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
import { UserService } from '../services/user.service';
import * as moment from 'moment';
@Component({
  selector: 'app-coursedetail',
  templateUrl: './coursedetail.component.html',
  styleUrls: ['./coursedetail.component.css']
})
export class CoursedetailComponent implements OnInit {
  topics: Array<Topic>
  isEdit: boolean;
  public CourseName: string;
  public Rating: number = 0.0;  
  public NumberOfVoters: number = 0.0; 
  public NumberOfParticipants: number = 0.0;
  public Price: number = 0.0;    
  public Description :string;
  public CourseHastag: string;
  public CourseLevel :string;
  public CourseDuration: string;
  public ThumbnailImage;
  public StartDate;
  public IsActive: Boolean;
  public LessonNumbers: number;
  public InstructorName : string ='';
  currentAccount: Account;
  public topicdata : Array<Topic>;
  public topicdataset: Topic[];
  public subtopicdataset: Subtopic[];
  public id;
  public subtopicdata: Subtopic[];
  constructor(private topicservice: TopicService,private datePipe: DatePipe,private subtopicservice: SubtopicService,private lessonservice: LessonService,private authenticationService: AuthenticationService,private router: Router,private courseService : CourseService,private route: ActivatedRoute,private userService: UserService) { 
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
  //this.loadpage();
  this.load();
  }

  ngOnInit(): void {
  }
  public gettopics = async () => {
    const list = await this.topicservice.gettopics() as Topic[];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        let topic = new Topic();
        topic.topicId = list[i].topicId;
        topic.topicTitle = list[i].topicTitle;
        topic.sessionNumber = list[i].sessionNumber;
        topic.lastUpdate = list[i].lastUpdate;
        topic.courseId = list[i].courseId;
        this.topics.push(topic);
      }
      return list;
    }
  }
  // public loadpage = async () =>{
  //   const course = await this.courseService.getcourse(this.id) as Course;
  //   this.CourseName = course.courseName;
  //   this.Rating = course.rating;
  //   this.NumberOfParticipants = course.numberOfParticipants;
  //   this.Price = course.price;
  //   this.StartDate = moment(course.startDate).format("DD/MM/YYYY");
  //   this.CourseDuration = course.courseDuration;
  //   this.Description = course.description;
  //   this.CourseHastag = course.hastag;
  //   this.CourseLevel = course.level;
  //   this.LessonNumbers = course.lessonNumbers;
  //   this.IsActive = course.isActive;
  //   var account = await this.userService.getaccount(course.accountId) as Account;
  //   this.InstructorName = account.username;
  //   this.topicdataset = await this.gettopicdatas(this.id);
  // }
  public gettopicdatas = async (id) => {
    const list = await this.topicservice.gettopics() as Topic[];
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if(list[i].courseId != id){
          list.splice(i, 1);
        }
      } 
    }
    return list;
  }
  public getsubtopics = async (id) =>{
    const list = await this.subtopicservice.getsubtopics() as Subtopic[];
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if(list[i].topicId !== id){
          list.splice(i, 1);
        }
      } 
    }
    return this.subtopicdataset = list;
  }
  public getsubtopicdata = async () =>{
    //await this.loadpage();
    await this.load();
    var topiclist : Topic[];
    topiclist = this.topicdataset;
    const list = await this.subtopicservice.getsubtopics() as Subtopic[];
    this.subtopicdata =list;
  }
  public videoUrls :string[] =[];
  public lessondataset: Lesson[];
  public show : boolean = false;
  @ViewChild(NgxY2PlayerComponent) video: NgxY2PlayerComponent;
  videoUrl :string;
  playerOptions: NgxY2PlayerOptions = {
    height: 'auto',
  };
  public showdetail = async (id) =>{
    const list = await this.lessonservice.getlessons() as Lesson[];
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if(list[i].subTopicId !== id){
          list.splice(i, 1);
        }
      } 
    }
    this.lessondataset = list;
    this.videoUrls = [];
    for(let i = 0;i<list.length;i++){
      this.videoUrls.push(list[i].lessonContent);
    }
    return this.lessondataset = list;
  }
  public load = async () =>{
    const course = await this.courseService.getcourse(this.id) as Course;
    this.CourseName = course.courseName;
    this.Rating = course.rating;
    this.NumberOfParticipants = course.numberOfParticipants;
    this.Price = course.price;
    this.StartDate = moment(course.startDate).format("DD/MM/YYYY");
    this.CourseDuration = course.courseDuration;
    this.Description = course.description;
    this.CourseHastag = course.hastag;
    this.CourseLevel = course.level;
    this.LessonNumbers = course.lessonNumbers;
    this.IsActive = course.isActive;
    var account = await this.userService.getaccount(course.accountId) as Account;
    this.InstructorName = account.username;
    this.topicdataset = await this.gettopicdatas(this.id);
    if(this.topicdataset){
    var count = 0;
    var listsubtopic : Subtopic[];
    var listlesson : Lesson[] = [];
    for(let i = 0; i<this.topicdataset.length;i++){
      listsubtopic = await this.getsubtopics(this.topicdataset[i].topicId);
      if(listsubtopic){
        for(let j = 0; j< listsubtopic.length;j++){
        const list = await this.lessonservice.getlessons() as Lesson[];
        if (list) {
        for(let k=0;k<list.length;k++){
          if(list[k].subTopicId ===  listsubtopic[j].subTopicId){
            // list.splice(k, 1);
            listlesson.push(list[k]);
            // count++;
          }
        }
        // listlesson = list;
        }
      }
    }
    }
    if(listlesson){
         this.videoUrls.push(listlesson[0].lessonContent); 
    }
    console.log(this.videoUrls);
    }
  }
}
