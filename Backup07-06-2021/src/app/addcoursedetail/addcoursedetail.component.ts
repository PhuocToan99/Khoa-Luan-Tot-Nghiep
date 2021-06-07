import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { Topic } from '../model/topic';
import { TopicDialogData } from '../dialog/shared/sharedata';
import { MatDialog } from '@angular/material/dialog';
import { TopicdialogComponent } from '../dialog/topicdialog/topicdialog.component';
import { DatePipe } from '@angular/common';
import { SubtopicService } from '../services/subtopic.service';
import { Router } from '@angular/router';
import { Subtopic } from '../model/subtopic';
import { SubtopicdialogComponent } from '../dialog/subtopicdialog/subtopicdialog.component';
import { Lesson } from '../model/lesson';
import { LessondialogComponent } from '../dialog/lessondialog/lessondialog.component';
import { LessonService } from '../services/lesson.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from '../model/Account';
import { CourseService } from '../services/course.service';
import { NgxY2PlayerOptions, NgxY2PlayerComponent } from 'ngx-y2-player';
import * as moment from 'moment';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { Course } from '../model/course';
import { CoursedialogComponent } from '../dialog/coursedialog/coursedialog.component';
import { ImageloadService } from '../services/imageload.service';
import { Questionpool } from '../model/questionpool';
import { QuestionpoolService } from '../services/questionpool.service';
import { NotificationService } from '../services/notification.service';
import { ExamQuiz } from '../model/examquiz';
import { ExamquizserviceService } from '../services/examquizservice.service';
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
  public LessonID: string = '';
  public LessonContent: string = '';
  public LessonTitle: string = '';
  public LessonNo: number = 0;
  isEdit: boolean;
  public CourseName: string;
  public Rating: number = 0.0;
  public NumberOfVoters: number = 0.0;
  public NumberOfParticipants: number = 0.0;
  public Price: number = 0.0;
  public Description: string[];
  public CourseHastag: string;
  public CourseLevel: string;
  public CourseDuration: string;
  public ThumbnailImage;
  public StartDate;
  public LessonNumbers: number;
  public IsActive: Boolean;
  public InstructorName: string = '';
  public AccountID;
  currentAccount: Account;
  public topicdata: Array<Topic>;
  public topicdataset: Topic[];
  public subtopicdataset: Subtopic[];
  public count = 0;
  public avatarPath;
  //currentUser: User;
  public coursedata: Course;
  public QuestionpoolId: string = '';
  public QuestionpoolName: string = '';
  public CreatedDate: Date;
  public LastEdited: Date;
  public QuestionpoolHastag:string ='';
  //public QuizCode: string='';
  public LessonId: string='';
  public QuestionpoolThumbnailImage;
  isEdited:string ="";
  questionpoolList:Questionpool[] = [];
  quizcount: number[] =[];
  examQuiz : ExamQuiz[] = [];
  constructor(private topicservice: TopicService,private notificationService: NotificationService, public dialog: MatDialog, private chRef: ChangeDetectorRef, private datePipe: DatePipe, private subtopicservice: SubtopicService, private lessonservice: LessonService, private authenticationService: AuthenticationService, private router: Router, 
  private courseService: CourseService, private userservice: UserService, private imageLoadService: ImageloadService,private questionpoolService: QuestionpoolService,
  private examQuizService:ExamquizserviceService) {
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    this.InstructorName = this.currentAccount.username;
    this.LastUpdate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    let courseInfo = localStorage.getItem("course");
    this.isEdited = localStorage.getItem("isEditedCourse");
    console.log(this.isEdited);
    if (courseInfo != null) {
      let savedCourse = JSON.parse(courseInfo);
      this.CourseId = parseInt(savedCourse.courseId);
      this.coursedata = savedCourse;
      this.topicdataset = null;
      this.loadpage();
    }
    else {
      this.router.navigate(['']);
    }
  }
  async ngOnInit() {
    var currentUser = await this.userservice.getuser(this.currentAccount.userId) as User;
    this.avatarPath = currentUser.avatarPath;
    this.chRef.detectChanges();
    await this.getExamList();
  }
  openTopicDialog(): void {
    const dialogRef = this.dialog.open(TopicdialogComponent, {
      width: '300px',
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
      width: '300px',
      data: { topicId: topic.topicId, topicTitle: topic.topicTitle, sessionNumber: topic.sessionNumber, courseId: topic.courseId, lastUpdate: topic.lastUpdate,isLocked: topic.isLocked }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      result.lastUpdate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      this.updateTopic(result);
    });
  }
  openSubtopicDialog(): void {
    const dialogRef = this.dialog.open(SubtopicdialogComponent, {
      width: '300px',
      data: { subTopicTitle: this.SubTopicTitle, subTopicNumber: this.SubTopicNumber,courseId : this.CourseId }
    });

    dialogRef.afterClosed().subscribe((result: Subtopic) => {
      if (result) {
        console.log(result);
        if (!this.isEdit) this.createNewSubtopic(result);
        // else this.updateExam(result);
      }

    });
  }
  openSubtopicDialog1(subtopic: Subtopic): void {
    const dialogRef = this.dialog.open(SubtopicdialogComponent, {
      width: '400px',
      data: { subTopicId: subtopic.subTopicId, subTopicTitle: subtopic.subTopicTitle, subTopicNumber: subtopic.subTopicNumber,courseId : this.CourseId }
    });

    dialogRef.afterClosed().subscribe((result: Subtopic) => {
      if (result) {
        console.log(result)
        this.updateSubtopic(result);
      }
    });
  }
  openLessonDialog(): void {
    const dialogRef = this.dialog.open(LessondialogComponent, {
      width: '400px',
      data: { lessonTitle: this.LessonTitle, lessonContent: this.LessonContent,courseId : this.CourseId }
    });

    dialogRef.afterClosed().subscribe((result: Lesson) => {
      if (result) {
        console.log(result);
        if (!this.isEdit) this.createNewLesson(result);
      }

    });
  }
  openLessonDialog1(lesson: Lesson): void {
    const dialogRef = this.dialog.open(LessondialogComponent, {
      width: '400px',
      data: { lessonId: lesson.lessonId, lessonTitle: lesson.lessonTitle, lessonContent: lesson.lessonContent, subTopicId: lesson.subTopicId,courseId : this.CourseId }
    });

    dialogRef.afterClosed().subscribe((result: Lesson) => {
      if (result) {
        console.log(result)
        this.updateLesson(result);
      }
    });
  }
  public createNewTopic = async (topic) => {
    this.topicdataset = null;
    try {
      let topicnew = new Topic();
      topicnew.topicTitle = topic.topicTitle;
      topicnew.lastUpdate = topic.lastUpdate;
      topicnew.courseId = topic.courseId;
      topicnew.isLocked = topic.isLocked;
      const result: any = await this.topicservice.posttopic(topicnew);
      console.log(result);
      this.notificationService.showNotification("Add new topic sucessfully","Create success",3000);
      this.loadpage();
    }
    catch (e) {
      this.notificationService.showDeleteNotification("Your topic created fail. Please try again","Create fail",3000);
      this.chRef.detectChanges();
    }
  };
  public updateTopic = async (topic: Topic) => {
    try {
      console.log(topic);
      const result = await this.topicservice.updatetopic(topic.topicId, topic);
      console.log(result);
      this.notificationService.showNotification("Update topic sucessfully","Update success",3000);
      this.loadpage();
    }
    catch (e) {
      console.log(e);
    }
  }
  public deleteTopic = async (id) => {
    try {
      var r = confirm("Are you want to delete this topic and all subtopic & lesson contain?");
      if (r) {
        await this.topicservice.deletetopic(id);
        this.notificationService.showDeleteNotification("Delete subtopic sucessfully","Delete success",3000);
        this.loadpage();
        this.chRef.detectChanges();
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  public createNewSubtopic = async (subtopic) => {
    try {
      let subtopicnew = new Subtopic();
      subtopicnew.subTopicTitle = subtopic.subTopicTitle;
      subtopicnew.topicId = subtopic.topicId;
      var count: any = await this.subtopicservice.getsubtopiccount(subtopic.topicId);
      Object.values(count);
      count = count + 1;
      subtopicnew.subTopicNumber = +Object.values(count);
      const result = await this.subtopicservice.postsubtopic(subtopicnew);
      console.log(result);
      if (result) {
        this.notificationService.showNotification("Add new subtopic sucessfully","Create success",3000);
      }
    }
    catch (e) {
      this.notificationService.showDeleteNotification("Your subtopic created fail. Please try again","Create fail",3000);
      // window.location.reload();
    }
  };
  public updateSubtopic = async (subtopic: Subtopic) => {
    try {
      console.log(subtopic);
      const result = await this.subtopicservice.updatesubtopic(subtopic.subTopicId, subtopic);
      console.log(result);
      this.notificationService.showNotification("Update new topic sucessfully","Update success",3000);
      this.loadpage();
      this.chRef.detectChanges();
    }
    catch (e) {
      console.log(e);
    }
  }
  public deleteSubtopic = async (id) => {
    try {
      var r = confirm("Are you want to delete this subtopic?");
      if (r) {
        await this.subtopicservice.deletesubtopic(id);
        const result = await this.lessonservice.getalllessonbycourseids(this.CourseId) as Lesson[];
        this.count = result.length;
        localStorage.setItem("count",this.count.toString());
        this.notificationService.showDeleteNotification("Delete subtopic sucessfully","Delete success",3000);
        await this.loadpage();
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  public createNewLesson = async (lesson) => {
    try {
      let lessonnew = new Lesson();
      this.count++;
      localStorage.setItem('count', JSON.stringify(this.count));
      lessonnew.lessonTitle = lesson.lessonTitle;
      lessonnew.lessonContent = lesson.lessonContent;
      lessonnew.subTopicId = lesson.subTopicId;
      lessonnew.lessonNo = this.count;
      const result = await this.lessonservice.postlesson(lessonnew);
      if (result) {
        this.notificationService.showNotification("Add new lesson sucessfully","Create success",3000);
        this.lessondataset.push(lessonnew);
      }
    }
    catch (e) {
      this.notificationService.showDeleteNotification("Your subtopic created fail. Please try again","Create fail",3000);
    }
  };
  public updateLesson = async (lesson: Lesson) => {
    try {
      console.log(lesson);
      const result = await this.lessonservice.updatelesson(lesson.lessonId, lesson);
      console.log(result);
      this.notificationService.showNotification("Update lesson sucessfully","Update success",3000);
      this.loadpage();
      this.chRef.detectChanges();
    }
    catch (e) {
      console.log(e);
    }
  }
  public deleteLesson = async (id) => {
    try {
      var r = confirm("Are you want to delete this lesson?");
      if (r) {
        await this.lessonservice.deletelesson(id);
        alert('Delete sucessfully');
        this.count--;
        localStorage.setItem('count', JSON.stringify(this.count));
        this.loadpage();
        this.chRef.detectChanges();
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  public loadpage = async () => {
    let courseInfo = localStorage.getItem("course");
    let savedCourse = JSON.parse(courseInfo);
    console.log(savedCourse);
    this.CourseName = savedCourse.courseName;
    this.Rating = savedCourse.rating;
    this.NumberOfParticipants = savedCourse.numberOfParticipants;
    this.Price = savedCourse.price;
    this.StartDate = moment(savedCourse.startDatemoment).format("DD/MM/YYYY");
    this.CourseDuration = savedCourse.courseDuration;
    var description;
    description = savedCourse.description;
    this.Description = description.split(".");
    this.Description = this.Description.filter(x => x !== "");
    this.CourseHastag = savedCourse.hastag;
    this.CourseLevel = savedCourse.level;
    this.LessonNumbers = savedCourse.lessonNumbers;
    this.IsActive = savedCourse.isActive;
    this.topicdataset = await this.topicservice.gettopicsbycourseid(savedCourse.courseId) as Topic[];
    this.lessondataset = await this.lessonservice.getalllessonbycourseids(savedCourse.courseId) as Lesson[];
    this.count = this.lessondataset.length;
    this.questionpoolList = await this.questionpoolService.getQuestionpoolByContainId(savedCourse.courseId) as Questionpool[];
    if(this.questionpoolList){
     for(let i =0;i<this.questionpoolList.length;i++){
       let result = await this.questionpoolService.getNumberOfQuizInQuestionpool(this.questionpoolList[i].questionpoolId) as number;
       this.quizcount.push(result);
     }
    }
  }
  public getsubtopics = async (id) => {
    const list = await this.subtopicservice.getSubtopicsByTopicId(id) as Subtopic[];
    return this.subtopicdataset = list;
  }
  public cancel() {
    var r = confirm("Are you want to delete this course?");
    if (r) {
      try {
        localStorage.removeItem('course');
        localStorage.removeItem('count');
        this.courseService.deletecourses(this.CourseId);
        alert("Your publish course have been cancel");
        this.router.navigate(['']);
      }
      catch (e) {
        console.log(e);
      }
    }
  }
  public publish() {
    if(this.isEdited =="1"){
      this.coursedata.lessonNumber = this.count;
      console.log(this.coursedata);
      this.courseService.updatecourses(this.coursedata);
      localStorage.removeItem('course');
      localStorage.removeItem('count');
      localStorage.removeItem('isEditedCourse');
      this.router.navigate(['managepublishcourse']);
    }
    else{
    this.coursedata.lessonNumber = this.count;
    console.log(this.coursedata);
    this.courseService.updatecourses(this.coursedata);
    localStorage.removeItem('course');
    localStorage.removeItem('count');
    this.notificationService.showNotification("Your course have been publish, you can modify in manage your pubish course","Create success",3000);
    this.router.navigate(['']);
    }
  }

  public videoUrls: string[];
  public lessondataset: Lesson[] = [];
  public show: boolean = false;
  @ViewChild(NgxY2PlayerComponent) video: NgxY2PlayerComponent;
  videoUrl: string;
  playerOptions: NgxY2PlayerOptions = {
    height: 'auto',
  };
  public showdetail = async (id) => {
    this.show = !this.show;
    this.lessondataset = await this.lessonservice.getLessonsBySubtopicId(id) as Lesson[];
    this.videoUrls = [];
    this.lessondataset.forEach(e =>{
      if(e.lessonContent != null || e.lessonContent != undefined){
        this.videoUrls.push(e.lessonContent);
      }
    })
    this.chRef.detectChanges();
  }
  openDialog(){
    const dialogRef = this.dialog.open(CoursedialogComponent, {
      width: '400px',
      data: {
        courseId: this.coursedata.courseId, courseName: this.CourseName, courseDuration: this.CourseDuration, 
        description: this.coursedata.description, startDate: this.StartDate, lastUpdate: this.LastUpdate, 
        hastag: this.coursedata.hastag, level: this.coursedata.level, thumbnailImage: this.coursedata.thumbnailImage, rating: this.coursedata.rating, 
        numberOfVoters: this.coursedata.numberOfVoters,
        numberOfParticipants: this.coursedata.numberOfParticipants, price: this.coursedata.price, lessonNumbers: this.LessonNumbers, isActive: this.coursedata.isActive, accountId: this.currentAccount.accountId
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result.courseId != null) {
        result.lastUpdate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
        result.lessonNumber = this.count;
        result.isActive = true;
        try {
          await this.courseService.updatecourses(result) as Course;
          this.coursedata = await this.courseService.getcourse(result.courseId) as Course;
          localStorage.setItem('course', JSON.stringify(this.coursedata)); 
          this.notificationService.showNotification("Update course information sucessfully","Update success",3000);
          this.loadpage();
          this.chRef.detectChanges();
        }
        catch (e) {
          console.log(e);
        }
      }
    });
  }
  // public updateCourse = async (course) => {
  //   try {
  //     const result = await this.courseService.updatecourses(this.coursedata.courseId, course) as Course;
  //     localStorage.setItem('course', JSON.stringify(course)); 
  //     this.notificationService.showNotification("Update course information sucessfully","Update success",3000);
  //     this.loadpage();
  //     this.chRef.detectChanges();
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }
  public loadimage(url) {
    return this.imageLoadService.getImageSource(url);
  }
  createQuestionpool(): void {
    this.router.navigate(['managequestionpool']);
  }
  quizCodeList: string[] = [];
  quizCodeNumber:string[] = [];
  quizIsActive:boolean[] = [];
  quizName:string[] = [];
  async getExamList(){
    var quizcode = "";
    var quizcount = 0;
    this.examQuiz = await this.examQuizService.getExamByCourseId(this.CourseId) as ExamQuiz[];
    console.log(this.examQuiz);
    if(this.examQuiz.length != 0){
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
          console.log(this.examQuiz[i].isBlocked);
          isActive =  isActive = this.examQuiz[i].isBlocked ? true : false;
          name = (this.examQuiz[i].examQuizName == "") ? "" : this.examQuiz[i].examQuizName;
          this.quizName.push(name);
          this.quizIsActive.push(isActive);
          this.quizCodeList.push(quizcode);
        }
      }
    }
    this.quizCodeNumber.push(quizcount.toString());
    console.log(this.quizName);
    console.log(this.quizIsActive);
    console.log(this.quizCodeList);
    console.log(this.quizCodeNumber);
  }
  goToExamManagement(id){
    console.log(id);
    localStorage.setItem("quizCode",id);
    this.router.navigate(['createexam']);
  }
  async changeLockedState(topic:Topic,i:number){
    topic.isLocked = !topic.isLocked;
    if(topic.topicId != undefined){
      await this.topicservice.updatetopic(topic.topicId,topic);
    }
    this.topicdataset[i] = topic;
    if(topic.isLocked == true){
      this.notificationService.showDeleteNotification("Topic have been locked","Update success",1500);
    }
    else{
      this.notificationService.showNotification("Topic have been unlocked","Update success",1500);
    }
    this.chRef.detectChanges();
  }
  async blockStateChange(quizCode){
    console.log(quizCode);
    var list = await this.examQuizService.getExamByCourseId(this.CourseId) as ExamQuiz[];
    list.forEach(async e => {if(e.examQuizCode == quizCode){
      e.isBlocked = !e.isBlocked;
      await this.examQuizService.updateExamQuiz(e);
    }
    });
    this.quizCodeList = [];
    this.quizCodeNumber = [];
    this.quizIsActive = [];
    this.quizName = [];
    await this.getExamList();
    this.chRef.detectChanges();
  }
}
