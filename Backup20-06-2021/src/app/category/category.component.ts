import { Component, OnInit } from '@angular/core';
import { CartService } from "../services/cart.service";
import { CourseService } from '../services/course.service';
import { Course,CourseDataSet } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from '../model/Account';
import { ImageloadService } from '../services/imageload.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../services/notification.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  public dataset: Course[] = [];
  public course: Course;
  currentAccount: Account;
  public itembuy: AccountInCourse[] = [];
  public login = false;
  public p: number = 1;
  namesearch;
  public courseDataSet:CourseDataSet[] = [];
  public limit: number = 20;
  public completeWords: true;

  isContentToggled: boolean[] = [];
  nonEditedContent: string;

  myControl = new FormControl();
  options: CourseDataSet[] = [];
  filteredOptions: Observable<CourseDataSet[]>;
  constructor(
    private cartService: CartService,
    private router: Router,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private accountincourseService: AccountincourseService,
    private imageLoadService: ImageloadService,private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    if (this.currentAccount) {
      this.login = true;
      this.getbuyitem();
    }
  }
  async ngOnInit() {
    await this.load();
  }
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
    });
  }
  addToCart = (course) => {
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
  };
  public loadimage(url) {
    return this.imageLoadService.getImageSource(url);
  }
  private load = async () => {
    const list = await this.courseService.getcourses() as Course[];
    if (list) {
      if(!this.currentAccount){
        list.forEach(e => {
        var courseData: CourseDataSet = new CourseDataSet();
        courseData.course = e;
        courseData.nonFormatedDescription = e.description;
        courseData.course.description = this.formatContent(e.description);
        courseData.rating = Math.floor(e.rating);
        courseData.check = ((e.rating - courseData.rating) >= 0.5) ? true : false;
        this.courseDataSet.push(courseData);
        this.isContentToggled.push(true);
        })
      }
      else{
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].accountId == this.currentAccount.accountId) {
            list.splice(i, 1);
          }
        }
        list.forEach(e => {
          var courseData: CourseDataSet = new CourseDataSet();
          courseData.course = e;
          courseData.nonFormatedDescription = e.description;
          courseData.course.description = this.formatContent(e.description);
          courseData.rating = Math.floor(e.rating);
          courseData.check = ((e.rating - courseData.rating) >= 0.5) ? true : false;
          this.courseDataSet.push(courseData);
          this.isContentToggled.push(true);
        })
      }
      this.options = this.courseDataSet;
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.options.slice())
        );
    }
  }
  displayFn(course): string {
    return course;
  }
  private _filter(name: string): CourseDataSet[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.course.courseName.toLowerCase().indexOf(filterValue) === 0);
  }
  viewdetail = async (id,course) => {
    await this.courseService.updatecourseviewcount(id,course);
    this.router.navigate(['/category', id], { relativeTo: this.route });
  }
  getbuyitem = async () => {
    this.itembuy = await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[];
  }
  coursealreadybought(id) {
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
  public onSearch = async () => {
    this.router.navigate(['/search'], {queryParams: {name: this.namesearch,option : 0, accountId : 0}});
  }
  async buyFreeCourse(course){
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
  toggleContent(index) {
    this.courseDataSet[index].course.description = this.isContentToggled[index] ? this.courseDataSet[index].nonFormatedDescription : this.formatContent(this.courseDataSet[index].nonFormatedDescription);
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }
}
