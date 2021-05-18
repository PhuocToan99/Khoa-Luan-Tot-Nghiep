import { Component, OnInit, ViewChild } from '@angular/core';
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
import { UserService } from '../services/user.service';
import { AccountincourseService } from '../services/accountincourse.service';
import { AccountInCourse } from '../model/accountincourse';
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
  constructor(private topicservice: TopicService,private subtopicservice: SubtopicService,private lessonservice: LessonService,private authenticationService: AuthenticationService,
    private router: Router,private courseService : CourseService,private route: ActivatedRoute,private userService: UserService,private accountincourseService: AccountincourseService) { 
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
  this.load();
  }

  ngOnInit(): void {
  }
  public getsubtopics = async (id) =>{
    const list = await this.subtopicservice.getSubtopicsByTopicId(id) as Subtopic[];
    return this.subtopicdataset = list;
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
    const list = await this.lessonservice.getLessonsBySubtopicId(id) as Lesson[];
    this.lessondataset = list;
    this.videoUrls = [];
    for(let i = 0;i<list.length;i++){
      this.videoUrls.push(list[i].lessonContent);
    }
    return this.lessondataset = list;
  }
  bought;
  public load = async () =>{
    const course = await this.courseService.getcourse(this.id) as Course;
    this.CourseName = course.courseName;
    this.topicdataset = await this.topicservice.gettopicsbycourseid(this.id) as Topic[];
    this.subtopicdataset = await this.subtopicservice.getSubtopicsByCourseId(this.id) as Subtopic[];
    var listlesson : Lesson[] = [];
    const courseAlreadeyBought = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
    var result = courseAlreadeyBought.find(x => x.accountId == this.currentAccount.accountId && x.courseId == this.id);
    this.bought = (result == undefined) ? false : true;
    listlesson = await this.lessonservice.getalllessonbycourseids(this.id) as Lesson[];
    if(listlesson){
         this.videoUrls.push(listlesson[0].lessonContent); 
    }
    console.log(this.videoUrls);
    }
}
