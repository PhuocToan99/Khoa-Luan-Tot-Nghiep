import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../services/course.service';
import { Course,CourseDesktopData } from '../model/course';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from '../model/Account';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import {CartService} from "../services/cart.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ImageloadService } from '../services/imageload.service';
import { NotificationService } from '../services/notification.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  namesearch;
  public courses : Course[] = [];
  public freeCourses : CourseDesktopData[] = [];
  public login = false;
  currentAccount: Account;
  public itembuy : AccountInCourse[];
  constructor(config: NgbCarouselConfig, private router: Router,private courseService:CourseService, private authenticationService: AuthenticationService, 
     private accountincourseService:AccountincourseService,private cartService:CartService, private route: ActivatedRoute,private imageLoadService:ImageloadService,
     private datePipe: DatePipe,private notificationService:NotificationService) {
    // customize default values of carousels used by this component tree
    config.interval = 2000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      if(this.currentAccount){
        this.login = true;
      }
      if(this.currentAccount && this.currentAccount.role == "admin"){
        this.router.navigateByUrl('admin/dashboard');
      }
  }
  async ngOnInit(): Promise<void> {
    await this.load();
  } 
  public onSearch = async () => {
    console.log(this.namesearch);
    this.router.navigate(['/search'], {queryParams: {name: this.namesearch,option : 0, accountId : 0}});
  }
  public load = async () => {
    this.courses = [];
    this.itembuy = (this.currentAccount) ? await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[] : [];
    const list = await this.courseService.gettopcourse() as Course[];
    console.log(list);
    const list1 = await this.courseService.getTop6CourseBase(1) as CourseDesktopData[];
    console.log(list1);
    if(this.currentAccount){
      // for(let i = 0; i< list.length;i++){
      //   if(list[i].accountId != this.currentAccount.accountId){
      //   this.courses.push(list[i]);
      //   }
      //   if(list1.length > 0){
      //     if(list1[i].course.accountId != this.currentAccount.accountId){
      //       this.freeCourses.push(list1[i]);
      //     }
      //   }
      // }
      for(let i = 0; i< list.length;i++){
        if(list[i].accountId != this.currentAccount.accountId){
        this.courses.push(list[i]);
        }
      }
      if(list1.length > 0){
        list1.forEach(e =>{if(e.course.accountId != this.currentAccount.accountId){
          this.freeCourses.push(e);
        }})
      }
    }
    else{
      this.courses = list;
      this.freeCourses = list1; 
    }
    console.log(this.courses);
  }
  coursealreadybought(id){
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
  public loadimage(url){
    return this.imageLoadService.getImageSource(url);
  }
  addToCart = (course) => {
    if(course.price > 0){
      this.cartService.addToCart({course,quantity:1});
    }
    else{
      this.buyFreeCourse(course);
    }
};
viewdetail = async (id,course) =>  {
  await this.courseService.updatecourseviewcount(id,course);
  this.router.navigate(['/category',id], { relativeTo: this.route });
}
buyFreeCourse(course){
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
  this.notificationService.showNotification("This course have been add to your course libary","Buy success",1500);
  this.router.navigateByUrl('mycourse'); 
}
makeid(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}
}
