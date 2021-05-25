import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../model/course';
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
@Component({
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.css']
})
export class MycourseComponent implements OnInit {
  courses: Array<Course>
  //nap du lieu cho nay
  settings: Object
  //Two way binding
  public CourseName: string = ''
  public Rating: string = ''
  public NumberOfParticipants: string = ''
  public Price: string = ''
  public StartDate: Date
  public LastUpdate: Date
  public CourseDuration: string = ''
  public Description: string = ''
  public Hastag: string = ''
  public Level: string = ''
  public dataset: Course[];
  public course: Course;
  currentAccount: Account;
  public itembuy : AccountInCourse[];
  public  p: number = 1;
  constructor(private router: Router,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private accountincourseService:AccountincourseService,
    private imageLoadService:ImageloadService,private datePipe:DatePipe,
    private commentService:CommentService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private chRef: ChangeDetectorRef) { 
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      if( this.currentAccount == null ) this.router.navigate(['/login']);
      // this.getbuyitem();
    }

  ngOnInit(): void {
    this.load();
  }
  private load = async () => {
    this.dataset = [];
    this.courses = new Array<Course>();
    var datasets = await this.courseService.getcourses() as Course[];
    var buyList = await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId) as AccountInCourse[];
    buyList.forEach( e => {
      var course = datasets.find(data => data.courseId == e.courseId);
      if(course != null && course != undefined){
        this.dataset.push(course);
      }
    });
    console.log(this.dataset);
  }
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0,  
    });
  }
  viewdetail = async (id) =>  {
    this.router.navigate(['/category',id], { relativeTo: this.route });
  }

public loadimage(url){
  return this.imageLoadService.getImageSource(url);
}
async rating(course:Course){
  var ratingData = new Comment();
  const dialogRef = this.dialog.open(RatingdialogComponent, {
    data: {commentContent: ratingData.commentContent,rating: ratingData.rating,datePost: ratingData.datePost,type: ratingData.type,accountId: ratingData.accountId,
      courseId: ratingData.courseId,lessonId: ratingData.lessonId}
  });

  dialogRef.afterClosed().subscribe(async result => {
    console.log(result);
    if(result != null && result != undefined){
      ratingData.rating = result.rating;
      ratingData.type="Rating";
      ratingData.commentContent = result.commentContent;
      ratingData.datePost = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      ratingData.accountId = this.currentAccount.accountId;
      ratingData.courseId = course.courseId;
      await this.commentService.postComment(ratingData);
      var ratingList = await this.commentService.getRatingByCourseId(ratingData.courseId) as Comment[];
      var totalRating: number = 0;
      ratingList.forEach(e => totalRating+=e.rating);
      var ratingRate = (totalRating/ratingList.length).toFixed(2);
      course.rating = parseFloat(ratingRate);
      console.log(course.rating);
      course.numberOfVoters = ratingList.length;
      console.log(course);
      await this.courseService.updatecourses(course.courseId,course);
      this.notificationService.showNotification("Thanks you!","For rating or service",1500);
      await this.load();
      this.chRef.detectChanges();
    }
  });
}
}
