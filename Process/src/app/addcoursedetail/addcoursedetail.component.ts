import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { Topic } from '../model/topic';
import { TopicDialogData } from '../dialog/shared/TopicDialogData/TopicDialogData';
import { MatDialog } from '@angular/material/dialog';
import { TopicdialogComponent } from '../dialog/topicdialog/topicdialog.component';
import { DatePipe } from '@angular/common';
import { SubtopicService } from '../services/subtopic.service';
import { Router} from '@angular/router';
import { Subtopic } from '../model/subtopic';
import {SubtopicdialogComponent} from '../dialog/subtopicdialog/subtopicdialog.component';
import { Lesson } from '../model/lesson';
import {LessondialogComponent} from '../dialog/lessondialog/lessondialog.component';
import { LessonService } from '../services/lesson.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { CourseService } from '../services/course.service';
import { NgxY2PlayerOptions, NgxY2PlayerComponent } from 'ngx-y2-player';
import * as moment from 'moment';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { Course } from '../model/course';
import { CoursedialogComponent } from '../dialog/coursedialog/coursedialog.component';
@Component({
  selector: 'app-addcoursedetail',
  templateUrl: './addcoursedetail.component.html',
  styleUrls: ['./addcoursedetail.component.css']
})
export class AddcoursedetailComponent implements OnInit {
  topicdialogData: Array<TopicDialogData>
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
  public Description :string[];
  public CourseHastag: string;
  public CourseDescription: string;
  public CourseLevel :string;
  public CourseDuration: string;
  public ThumbnailImage;
  public StartDate;
  public LessonNumbers: number;
  public IsActive: Boolean;
  public InstructorName : string ='';
  public AccountID;
  currentAccount: Account;
  public topicdata : Array<Topic>;
  public topicdataset: Topic[];
  public subtopicdataset: Subtopic[];
  public count = 0;
  public avatarPath;
  //currentUser: User;
  public coursedata:Course;
  constructor(private topicservice: TopicService, public dialog: MatDialog, private chRef: ChangeDetectorRef,private datePipe: DatePipe,private subtopicservice: SubtopicService,private lessonservice: LessonService,private authenticationService: AuthenticationService,private router: Router,private courseService : CourseService,private userservice: UserService) {
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    this.InstructorName = this.currentAccount.username;
    let topic = new Topic();
    this.LastUpdate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    let courseInfo = localStorage.getItem("course");
    if(courseInfo!= null){
    let savedCourse = JSON.parse(courseInfo);
    this.CourseId = parseInt(savedCourse.courseId);
    this.coursedata = savedCourse;
    this.topicdataset = null;
    this.loadpage();
    }
    else{
      this.router.navigate(['']);
    }
   }
  async ngOnInit() {
    this.chRef.detectChanges();
  }
  ngOnDestroy(): void
  {
    this.count = 0;
    localStorage.setItem('count', JSON.stringify(this.count));
  }
  openTopicDialog(): void {
    const dialogRef = this.dialog.open(TopicdialogComponent, {
      width: '400px',
      data: { topicId: this.TopicID, topicTitle: this.TopicTitle, sessionNumber: this.SessionNumber, courseId: this.CourseId, lastUpdate: this.LastUpdate }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        this.createNewTopic(result);
    });

  } 
  openTopicDialog1(topic: Topic): void {
    console.log(topic);
    const dialogRef = this.dialog.open(TopicdialogComponent, {
      width: '400px',
      data: { topicId: topic.topicId, topicTitle: topic.topicTitle, sessionNumber: topic.sessionNumber, courseId: topic.courseId, lastUpdate: topic.lastUpdate }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        result.lastUpdate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
        this.updateTopic(result);
    });
  }
  openSubtopicDialog(): void {
    const dialogRef = this.dialog.open(SubtopicdialogComponent, {
      width: '400px',
      data: { subTopicTitle: this.SubTopicTitle, subTopicNumber: this.SubTopicNumber }
    });

    dialogRef.afterClosed().subscribe((result: Subtopic) => {
      if (result)
      {
        console.log(result);
        if (!this.isEdit) this.createNewSubtopic(result);
        // else this.updateExam(result);
      }
        
    });
  }
  openSubtopicDialog1(subtopic: Subtopic): void {
    const dialogRef = this.dialog.open(SubtopicdialogComponent, {
      width: '400px',
      data: { subTopicTitle: subtopic.subTopicTitle, subTopicNumber: subtopic.subTopicNumber }
    });

    dialogRef.afterClosed().subscribe((result: Subtopic) => {
      if (result)
      {
        console.log(result);
        if (!this.isEdit) this.createNewSubtopic(result);
        // else this.updateExam(result);
      }
        
    });
  }
  openLessonDialog(): void {
    const dialogRef = this.dialog.open(LessondialogComponent, {
      width: '400px',
      data: { lessonTitle: this.LessonTitle, lessonContent: this.LessonContent }
    });

    dialogRef.afterClosed().subscribe((result: Lesson) => {
      if (result)
      {
        console.log(result);
        if (!this.isEdit) this.createNewLesson(result);
      }
        
    });
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
  public createNewTopic = async (topic) => {
    this.topicdataset = null;
    try {
      let topicnew = new Topic();
      topicnew.topicTitle = topic.topicTitle;
      topicnew.lastUpdate = topic.lastUpdate;
      topicnew.courseId = topic.courseId;
      const result: any = await this.topicservice.posttopic(topicnew);
      console.log(result);
      alert('Add sucessfully');
      this.loadpage();
    }
    catch (e) {
      alert('Add failed');
      window.location.reload();
    }
  };
  public updateTopic = async (topic:Topic) => {
    try {
      console.log(topic);
      const result = await this.topicservice.updatetopic(topic.topicId, topic);
      console.log(result);
      alert('Update sucessfully');
      this.loadpage();
    }
    catch (e) {
      console.log(e);
    }
  }
  public deleteTopic = async (id) => {
    try {
      var r = confirm("Are you want to delete this toppic?");
      if (r){
      await this.topicservice.deletetopic(id);
      alert('Delete sucessfully');
      this.loadpage();
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  public createNewSubtopic = async (subtopic) => {
    try 
    {
      let subtopicnew = new Subtopic();
      subtopicnew.subTopicTitle = subtopic.subTopicTitle;
      subtopicnew.topicId = subtopic.topicId;
      var count: any = await this.subtopicservice.getsubtopiccount(subtopic.topicId);
      Object.values(count);
      count = count + 1;
      subtopicnew.subTopicNumber = +Object.values(count);
      const result = await this.subtopicservice.postsubtopic(subtopicnew);
      console.log(result);
      if (result)
      {
        alert('Add sucessfully');
      }    
    }
    catch (e) {
      alert('Add failed');
      window.location.reload();
    }
  };
  public updateSubtopic = async (subtopic:Subtopic) => {
    try {
      console.log(subtopic);
      const result = await this.subtopicservice.updatesubtopic(subtopic.topicId,subtopic);
      console.log(result);
      alert('Update sucessfully');
      this.loadpage();
    }
    catch (e) {
      console.log(e);
    }
  }
  public createNewLesson = async (lesson) => {
    try 
    {
      let lessonnew = new Lesson();
      this.count++;
      localStorage.setItem('count', JSON.stringify(this.count));
      lessonnew.lessonTitle = lesson.lessonTitle;
      lessonnew.lessonContent = lesson.lessonContent;
      lessonnew.subTopicId = lesson.subTopicId;
      lessonnew.lessonNo = this.count;
      const result = await this.lessonservice.postlesson(lessonnew);
      if (result)
      {
        alert('Add sucessfully');
      }    
    }
    catch (e) {
      alert('Add failed');
    }
  };
  public loadpage = async () =>{
    let courseInfo = localStorage.getItem("course");
    let savedCourse = JSON.parse(courseInfo);
    this.CourseName = savedCourse.courseName;
    this.Rating = savedCourse.rating;
    this.NumberOfParticipants = savedCourse.numberOfParticipants;
    this.Price = savedCourse.price;
    this.StartDate = moment(savedCourse.startDatemoment).format("DD/MM/YYYY");
    this.CourseDuration = savedCourse.courseDuration;
    var description;
    description = savedCourse.description;
    this.Description = description.split(".");
    this.CourseHastag = savedCourse.hastag;
    this.CourseLevel = savedCourse.level;
    this.LessonNumbers = savedCourse.lessonNumbers;
    this.IsActive = savedCourse.isActive;
    this.topicdataset = await this.gettopicdatas(savedCourse.courseId);
    var currentUser = await this.userservice.getuser(this.currentAccount.userId) as User;
    this.avatarPath = currentUser.avatarPath;
    let lessoncount = localStorage.getItem("count");
    // console.log(lessoncount);
    let countlesson = JSON.parse(lessoncount);
    // console.log(countlesson);
    if(countlesson == null) this.count = 0;
    else{
    this.count = parseInt(countlesson);
    console.log(this.count);
    }
  }
  public gettopicdatas = async (id) => {
    const list = await this.topicservice.gettopics() as Topic[];
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if(list[i].courseId !== id){
          list.splice(i, 1);
        }
      } 
    }
    return list;
  }
  public getsubtopics = async (id) =>{
    const list = await this.topicservice.gettopic(id) as Topic;
    const list1 = await this.subtopicservice.getsubtopics() as Subtopic[];
    if (list1) {
      for (let i = list1.length - 1; i >= 0; i--) {
        if(list1[i].topicId !== list.topicId){
          list1.splice(i, 1);
        }
      } 
    }
    return this.subtopicdataset = list1;
  }
  public check = async (topicid,subtopicid) =>{
    if (this.subtopicdataset) {
      for (let i = this.subtopicdataset.length - 1; i >= 0; i--) {
        if(this.subtopicdataset[i].topicId != this.topicdataset[subtopicid].topicId && this.subtopicdataset[i].subTopicId == topicid){
          return false;
        }
      } 
    }
    return true;
  }
  public cancel(){
    var r = confirm("Are you want to delete this course?");
    if (r){
      try{
    localStorage.removeItem('course');
    localStorage.removeItem('count');
    this.courseService.deletecourses(this.CourseId);
    if(this.topicdataset != null){
      for(let i=0; i<this.topicdataset.length; i++){
        try{
        this.topicservice.deletetopic(this.topicdataset[i].topicId);
        }
        catch(e){
          alert(e);
        }
      }
    }
    if(this.subtopicdataset != null){
      for(let i=0; i<this.subtopicdataset.length; i++){
        try{
        this.subtopicservice.deletesubtopic(this.subtopicdataset[i].subTopicId);
        }
        catch(e){
          alert(e);
        }
    }
    }
    window.location.reload();
    alert("Delete success");
    this.router.navigate(['']);
      }
      catch (e){
        console.log(e);
      }
    }
  }
  public publish(){
    this.coursedata.lessonNumbers = this.count;
    console.log(this.coursedata);
    this.courseService.updatecourses(this.CourseId,this.coursedata);
    localStorage.removeItem('course');
    localStorage.removeItem('count');
    this.router.navigate(['']);
  }
  
  public videoUrls :string[];
  public lessondataset: Lesson[];
  public show : boolean = false;
  @ViewChild(NgxY2PlayerComponent) video: NgxY2PlayerComponent;
  videoUrl :string;
  playerOptions: NgxY2PlayerOptions = {
    height: 'auto',
  };
  public showdetail = async (id) =>{
    this.show = !this.show;
    const list = await this.lessonservice.getlessons() as Lesson[];
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if(list[i].subTopicId !== id){
          list.splice(i, 1);
        }
      } 
    }
    console.log(list);
    this.lessondataset = list;
    this.videoUrls = [];
    for(let i = 0;i<list.length;i++){
      this.videoUrls.push(list[i].lessonContent);
    }
    console.log(this.videoUrls);
    return this.lessondataset = list;
  }
  public showall = async () =>{
    console.log(this.topicdataset);
    const list1 = await this.subtopicservice.getsubtopics() as Subtopic[];
    var listsub : Subtopic[];
    if (list1) {
      for (let i = list1.length - 1; i >= 0; i--) {
        for(let j = this.topicdataset.length - 1; j>=0;j--){
        var topic =this.topicdataset[j].topicId;
        var subtopic =list1[i].topicId;
        if(subtopic != topic){
          list1.splice(i, 1);
          i--;
        }
      }
      } 
    }
    console.log(list1);
  }
  getImageMime(base64: string): string
{
  if (base64.charAt(0)=='/') return 'jpg';
  else if (base64.charAt(0)=='R') return "gif";
  else if(base64.charAt(0)=='i') return 'png';
  else return 'jpeg';
}
getImageSource(url): string
{
  return `data:image/${this.getImageMime(url)};base64,${url}`; 
}
pushData(): void {
  this.CourseId = this.coursedata.courseId;
  this.CourseName = this.coursedata.courseName,
  this.CourseDescription = this.coursedata.description,
  this.StartDate = this.coursedata.startDate,
  this.LastUpdate = this.coursedata.lastUpdate,
  this.CourseHastag = this.coursedata.hastag,
  this.CourseLevel = this.coursedata.level,
  this.ThumbnailImage = this.coursedata.thumbnailImage,
  this.Rating = this.coursedata.rating,
  this.NumberOfVoters = this.coursedata.numberOfVoters,
  this.NumberOfParticipants = this.NumberOfParticipants,
  this.Price = this.coursedata.price,
  this.LessonNumbers = this.count,
  this.IsActive = this.coursedata.isActive,
  this.AccountID = this.coursedata.accountId;
} 
openDialog(): void {

  const dialogRef = this.dialog.open(CoursedialogComponent, {
    width: '400px',
    data: {
      courseId: this.coursedata.courseId, courseName: this.CourseName, courseDuration: this.CourseName, description: this.CourseDescription, startDate: this.StartDate, lastUpdate: this.LastUpdate, hastag: this.CourseHastag, level: this.CourseLevel, thumbnailImage: this.ThumbnailImage, rating: this.Rating, numberOfVoters: this.NumberOfVoters,
      numberOfParticipants: this.NumberOfParticipants,price: this.Price,lessonNumbers: this.LessonNumbers,isActive: this.IsActive,accountId: this.AccountID
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result.courseId != null) {
      result.lastUpdate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      console.log(this.count);
      result.lessonNumber = this.count;
      console.log(result);
      this.updateCourse(result);
    }
  });
  }
  public updateCourse = async (course) => {
    try {
      const result = await this.courseService.updatecourses(this.coursedata.courseId, course);
      localStorage.setItem('course', JSON.stringify(course));
      console.log(result);
      alert('Update sucessfully');
      this.loadpage();
    }
    catch (e) {
      console.log(e);
    }
  }

}
