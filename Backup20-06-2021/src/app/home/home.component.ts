import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course,CourseDesktopData,CourseDataSet } from '../model/course';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from '../model/Account';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import {CartService} from "../services/cart.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ImageloadService } from '../services/imageload.service';
import { NotificationService } from '../services/notification.service';
import { DatePipe } from '@angular/common';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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
  public courseDataSet:CourseDataSet[] = [];
  public freeCourseDataSet:CourseDataSet[] = [];
  public limit: number = 20;
  public completeWords: true;

  isContentToggled: boolean[] = [];
  isContentToggled1: boolean[] = [];
  nonEditedContent: string;

  myControl = new FormControl();
  options: CourseDataSet[] = [];
  filteredOptions: Observable<CourseDataSet[]>;
  constructor(private router: Router,private courseService:CourseService, private authenticationService: AuthenticationService, 
     private accountincourseService:AccountincourseService,private cartService:CartService, private route: ActivatedRoute,private imageLoadService:ImageloadService,
     private datePipe: DatePipe,private notificationService:NotificationService) {
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
    const list1 = await this.courseService.getTop6CourseBase(1) as CourseDesktopData[];
    const list2 = await this.courseService.getcourses() as Course[];
    var optionCourseDataSet:CourseDataSet[] = [];
    if(this.currentAccount){
      for(let i = 0; i< list.length;i++){
        if(list[i].accountId != this.currentAccount.accountId){
          var courseData: CourseDataSet = new CourseDataSet();
          courseData.course = list[i];
          courseData.nonFormatedDescription = list[i].description;
          courseData.course.description = this.formatContent(list[i].description);
          courseData.rating = Math.floor(list[i].rating);
          courseData.check = ((list[i].rating - courseData.rating) >= 0.5) ? true : false;
          this.courseDataSet.push(courseData);
          this.isContentToggled.push(true);
        }
      }
      if(list1.length > 0){
        list1.forEach(e => {
          if(e.course.accountId != this.currentAccount.accountId){
            var freeCourseData: CourseDataSet = new CourseDataSet();
            freeCourseData.course = e.course;
            freeCourseData.rating = Math.floor(e.course.rating);
            freeCourseData.nonFormatedDescription = e.course.description;
            freeCourseData.course.description = this.formatContent(e.course.description);
            freeCourseData.check = ((e.course.rating - freeCourseData.rating) >= 0.5) ? true : false;
            this.freeCourseDataSet.push(freeCourseData);
            this.isContentToggled1.push(true);
          }
        })
      }
    }
    else{
      list.forEach(e =>{
        var courseData: CourseDataSet = new CourseDataSet();
          courseData.course = e;
          courseData.nonFormatedDescription = e.description;
          courseData.course.description = this.formatContent(e.description);
          courseData.rating = Math.floor(e.rating);
          courseData.check = ((e.rating - courseData.rating) >= 0.5) ? true : false;
          this.courseDataSet.push(courseData);
          this.isContentToggled.push(true);
      });
      list1.forEach(e =>{
        var freeCourseData: CourseDataSet = new CourseDataSet();
        freeCourseData.course = e.course;
        freeCourseData.nonFormatedDescription = e.course.description;
        freeCourseData.course.description = this.formatContent(e.course.description);
        freeCourseData.rating = Math.floor(e.course.rating);
        freeCourseData.check = ((e.course.rating - freeCourseData.rating) >= 0.5) ? true : false;
        this.freeCourseDataSet.push(freeCourseData);
        this.isContentToggled1.push(true);
      });
    }
    for(let i = 0; i< list2.length;i++){
      if(list2[i].accountId != this.currentAccount.accountId){
        var courseData: CourseDataSet = new CourseDataSet();
        courseData.course = list2[i];
        optionCourseDataSet.push(courseData);
      }
    }
    this.options = optionCourseDataSet;
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
toggleContent(index,type) {
  if(type == 'normal'){
  this.courseDataSet[index].course.description = this.isContentToggled[index] ? this.courseDataSet[index].nonFormatedDescription : this.formatContent(this.courseDataSet[index].nonFormatedDescription);
  }
  if(type == 'free'){
    this.freeCourseDataSet[index].course.description = this.isContentToggled1[index] ? this.freeCourseDataSet[index].nonFormatedDescription : this.formatContent(this.freeCourseDataSet[index].nonFormatedDescription);
  }
}

formatContent(content: string) {
  if (this.completeWords) {
    this.limit = content.substr(0, this.limit).lastIndexOf(' ');
  }
  return `${content.substr(0, this.limit)}...`;
}
}
