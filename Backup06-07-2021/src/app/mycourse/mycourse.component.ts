import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course,CourseDataSet } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { ImageloadService } from '../services/imageload.service';
import { DatePipe } from '@angular/common';
import { RatingdialogComponent } from '../dialog/ratingdialog/ratingdialog.component';
import {MatDialog} from '@angular/material/dialog';
import { Comment } from  '../model/comment';
import { CommentService } from '../services/comment.service';
import { NotificationService } from '../services/notification.service';
import { User } from '../model/user';
import { UserService } from '../services/user.service';


import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.css']
})
export class MycourseComponent implements OnInit {
  public dataset: Course[] = [];
  public courseDataSet:CourseDataSet[] = [];
  public course: Course;
  currentAccount: Account;
  currentUser:User;
  public itembuy : AccountInCourse[];
  isContentToggled: boolean[] = [];
  public  p: number = 1;
  myControl = new FormControl();
  options: CourseDataSet[] = [];
  filteredOptions: Observable<CourseDataSet[]>;
  constructor(private router: Router,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private accountInCourseService:AccountincourseService,
    private imageLoadService:ImageloadService,private datePipe:DatePipe,
    private commentService:CommentService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private chRef: ChangeDetectorRef,
    private userService:UserService) { 
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    }
  ngOnInit(): void {
    this.load();
  }
  private async load() {
    this.dataset = [];
    this.courseDataSet = [];
    var datasets = await this.courseService.getcourses() as Course[];
    this.currentUser = await this.userService.getUserByAccountId(this.currentAccount.accountId) as User;
    var buyList = await this.accountInCourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[];
    buyList.forEach( e => {
      var course = datasets.find(data => data.courseId == e.courseId);
      if(course != undefined){
        this.courseService.transferToCourseDataset(course,this.courseDataSet,this.isContentToggled);
      }
    });
    this.options = this.courseDataSet;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }
  displayFn(course): string {
    return course;
  }
  private _filter(name: string): CourseDataSet[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.course.courseName.toLowerCase().indexOf(filterValue) === 0);
  }
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0,  
    });
  }
  viewdetail = async (id,course) =>  {
    await this.courseService.updatecourseviewcount(id,course);
    this.router.navigate(['/category',id], { relativeTo: this.route });
  }

public loadimage(url){
  return this.imageLoadService.getImageSource(url);
}
async rating(course:Course){
  var ratingData = new Comment();
  var ratingList = await this.commentService.getRatingByCourseId(course.courseId) as Comment[];
  var ratingResult = ratingList.find(e => e.userId == this.currentUser.userId);
  ratingData.rating = (ratingResult) ? ratingResult.rating : undefined;
  var isPost = (!ratingResult) ? true : false; 
  const dialogRef = this.dialog.open(RatingdialogComponent, {
    data: {commentContent: ratingData.commentContent,rating: ratingData.rating,datePost: ratingData.datePost,type: ratingData.type,userId: this.currentUser.userId,
      courseId: course.courseId,lessonId: ratingData.lessonId}
  });

  dialogRef.afterClosed().subscribe(async result => {
    console.log(result);
    if(result != null && result != undefined){
      if(isPost){
      ratingData.rating = result.rating;
      ratingData.type="Rating";
      ratingData.commentContent = result.commentContent;
      ratingData.datePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      ratingData.userId = this.currentUser.userId;
      ratingData.courseId = course.courseId;
      ratingData.isLiked = false;
      ratingData.likeCount = 0;
      await this.commentService.postComment(ratingData);
      var ratingList = await this.commentService.getRatingByCourseId(ratingData.courseId) as Comment[];
      var totalRating: number = 0;
      ratingList.forEach(e => totalRating += e.rating);
      var ratingRate = (totalRating/ratingList.length).toFixed(2);
      course.rating = parseFloat(ratingRate);
      course.numberOfVoters = ratingList.length;
      await this.courseService.updatecourses(course);
      this.notificationService.showNotification("For rating or service","Thanks you!",1500);
      await this.load();
      this.chRef.detectChanges();
      }
      else{
        ratingData = ratingResult;
        ratingData.rating = result.rating;
        ratingData.datePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
        await this.commentService.updateComment(ratingData);
        var ratingList = await this.commentService.getRatingByCourseId(ratingData.courseId) as Comment[];
        var totalRating: number = 0;
        ratingList.forEach(e => totalRating+=e.rating);
        var ratingRate = (totalRating/ratingList.length).toFixed(2);
        course.rating = parseFloat(ratingRate);
        course.numberOfVoters = ratingList.length;
        await this.courseService.updatecourses(course);
        this.notificationService.showNotification("Update your rating success!","Update rating",1500);
        await this.load();
        this.chRef.detectChanges();
      }
    }
  });
}
public namesearch;
async onSearch(){
  if(this.namesearch == null || this.namesearch == undefined || this.namesearch == ""){
    this.courseDataSet = [];
    this.load();
  }
  else{
    this.courseDataSet = [];
    this.dataset = await this.courseService.getCourseSearch(this.namesearch,1,this.currentAccount.accountId) as Course[];
    this.dataset.forEach(e => {
      this.courseService.transferToCourseDataset(e,this.courseDataSet,this.isContentToggled);
    })
    this.chRef.detectChanges();
  }
}
toggleContent(index) {
  this.courseDataSet[index].course.description = this.isContentToggled[index] ? this.courseDataSet[index].nonFormatedDescription : this.courseService.formatContent(this.courseDataSet[index].nonFormatedDescription);
}
}
