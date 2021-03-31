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
    private router: Router,
    private imageLoadService:ImageloadService) { 
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
    this.getsubtopicdata();
  }
changeQuantity = (newQuantity:number) => {
    this.quantity = newQuantity;
};
addToCart = (course) => {
    if(this.quantity) this.cartService.addToCart({course,quantity:this.quantity})
};

public loadimage(url){
  return this.imageLoadService.getImageSource(url);
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
public loadpage = async () =>{
  const course = await this.courservice.getcourse(this.id) as Course;
  this.CourseName = course.courseName;
  this.Rating = course.rating;
  this.NumberOfParticipants = course.numberOfParticipants;
  this.Price = course.price;
  this.StartDate = moment(course.startDate).format("DD/MM/YYYY");
  this.CourseDuration = course.courseDuration;
  var description;
  description = course.description;
  this.Description = description.split(".");
  this.CourseHastag = course.hastag;
  this.CourseLevel = course.level;
  var account = await this.userservice.getaccount(course.accountId) as Account;
  this.InstructorName = account.username;
  const user = await this.userservice.getuser(account.userId) as User;
  this.instructor = user;
  this.topicdataset = await this.gettopicdatas(this.id);
  const courseAlreadeyBought = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
  for(let i=0;i < courseAlreadeyBought.length;i++){
    if(courseAlreadeyBought[i].accountId == this.currentAccount.accountId && courseAlreadeyBought[i].courseId == this.id)
    {
      this.bought = true;
    }
  } 
}
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
  await this.loadpage();
  var topiclist : Topic[];
  topiclist = this.topicdataset;
  const list = await this.subtopicservice.getsubtopics() as Subtopic[];
  this.subtopicdata =list;
}
}
