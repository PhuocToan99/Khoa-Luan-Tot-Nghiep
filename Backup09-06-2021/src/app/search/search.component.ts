import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Course,CourseDataSet } from '../model/course';
import { SearchService } from '../services/search.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { CourseService } from '../services/course.service';
import {CartService} from "../services/cart.service";
import { ImageloadService } from '../services/imageload.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  currentAccount: Account;
  public login = false;
  public courseDataSet:CourseDataSet[] = [];
  public limit: number = 20;
  public completeWords: true;

  isContentToggled: boolean[] = [];
  nonEditedContent: string;
  constructor(private authenticationService: AuthenticationService,private service:SearchService, 
              private router: Router, private route: ActivatedRoute, private accountincourseService:AccountincourseService,
              private courseService: CourseService, private cartService:CartService,private imageLoadService:ImageloadService,
              private datePipe: DatePipe,private notificationService: NotificationService) { 
                this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
                this.login = (this.currentAccount) ? true : false;
              }
  name = '';
  option;
  accountId;
  bool = true;
  courses; 
  items: Course[] = [];
  public  p: number = 1;
  public itembuy : AccountInCourse[];
  async ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.name = params["name"] || null;
      this.option = params["option"];
      this.accountId = params["accountId"];
    });
      this.itembuy = (this.currentAccount) ? await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[] : [];
      if (this.name == null){
      this.items = await this.courseService.getcourses() as Course[];
      this.items.forEach(e => {
        var courseData: CourseDataSet = new CourseDataSet();
        courseData.course = e;
        courseData.nonFormatedDescription = e.description;
        courseData.course.description = this.formatContent(e.description);
        courseData.rating = Math.floor(e.rating);
        courseData.check = ((e.rating - courseData.rating) >= 0.5) ? true : false;
        this.courseDataSet.push(courseData);
        this.isContentToggled.push(true);
      });
    }
    else {
      this.search(this.name,this.option,this.accountId);
    }
  }
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0,  
    });
  }
  namesearch;
  async onSearch(namesearch){
    this.courseDataSet = [];
    if (namesearch == null){
      this.items = await this.courseService.getcourses() as Course[];
      this.items.forEach(e => {
        var courseData: CourseDataSet = new CourseDataSet();
        courseData.course = e;
        courseData.rating = Math.floor(e.rating);
        courseData.nonFormatedDescription = e.description;
        console.log(this.formatContent(e.description));
        courseData.course.description = this.formatContent(e.description);
        courseData.check = ((e.rating - courseData.rating) >= 0.5) ? true : false;
        this.courseDataSet.push(courseData);
        this.isContentToggled.push(true);
      });
    }
    else {
      this.search(namesearch,0,0);
    }
  }
  public search(name,option,accountId) {
      this.courses = this.service.getsearchcourse(name,option,accountId).subscribe(
        (data) => {
          if (data != null) {
            this.courseDataSet = [];
            this.items = data;
            this.items.forEach(e => {
              var courseData: CourseDataSet = new CourseDataSet();
              courseData.course = e;
              courseData.nonFormatedDescription = e.description;
              courseData.course.description = this.formatContent(e.description);
              courseData.rating = Math.floor(e.rating);
              courseData.check = ((e.rating - courseData.rating) >= 0.5) ? true : false;
              this.courseDataSet.push(courseData);
              this.isContentToggled.push(true);
            });
            this.bool = false;
          }
          else {
            this.bool = true;
          }
        }
      )
  }
  public loadimage(url){
    return this.imageLoadService.getImageSource(url);
  }
  coursealreadybought(id)  {
    if(this.currentAccount == undefined || this.currentAccount == null){
      return false;
    }
    var find;
    if(this.currentAccount){
    if (this.itembuy) {
      find = this.itembuy.find(e => e.courseId == id);
    }
    else{
      return false;
    }
    }
    return (!find) ? true : false;
  }
  addToCart = (course) => {
    console.log(this.currentAccount);
    if(!this.currentAccount){
      this.router.navigate(['login']);
    }
    else{
      if(course.price != 0){
        this.cartService.addToCart({course,quantity:1})
      }
      else{
        this.buyFreeCourse(course);
      }
    }
  }
  async buyFreeCourse(course){
    var invoiceCode = this.makeid(6);
    var accountInCourse: AccountInCourse = new AccountInCourse();
    //console.log(this.currentAccount.accountId);
    accountInCourse.accountId = this.currentAccount.accountId;
    accountInCourse.courseId = course.courseId;
    accountInCourse.isBought = true;
    accountInCourse.paymentMethod = "Account Balance";
    accountInCourse.invoiceCode = invoiceCode;
    accountInCourse.getPayment = false;
    accountInCourse.createdDate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    this.accountincourseService.postaccountincourse(accountInCourse);
    var instructorInCourse:AccountInCourse = new AccountInCourse();
    instructorInCourse.accountId = course.accountId;
    instructorInCourse.courseId = course.courseId;
    instructorInCourse.isBought = false;
    instructorInCourse.getPayment = true;
    instructorInCourse.paymentMethod = "Account Balance";
    instructorInCourse.invoiceCode = invoiceCode;
    instructorInCourse.createdDate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    this.accountincourseService.postaccountincourse(instructorInCourse);
    var invoiceInstructorlist : AccountInCourse[] = [];
    var invoiceList = await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[]; 
    console.log(invoiceList);
    alert('Pay success');
    this.notificationService.showNotification("This course have been add to your course libary","Buy success",1500);
    this.router.navigateByUrl('invoicehistory'); 
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
  viewdetail = async (id,course) =>  {
    await this.courseService.updatecourseviewcount(id,course);
    this.router.navigate(['/category',id], { relativeTo: this.route });
  }
  toggleContent(course:CourseDataSet) {
    var index = this.courseDataSet.findIndex(e => e == course);
    this.isContentToggled[index] = !this.isContentToggled[index];
    this.courseDataSet[index].course.description = this.isContentToggled[index] ? this.courseDataSet[index].nonFormatedDescription : this.formatContent(this.courseDataSet[index].nonFormatedDescription);
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }
}
