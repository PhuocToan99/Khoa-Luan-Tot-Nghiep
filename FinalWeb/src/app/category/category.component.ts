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
import { MatDialog } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import { FiltersearchComponent } from '../dialog/filtersearch/filtersearch.component';
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
  isContentToggled: boolean[] = [];
  myControl = new FormControl();
  searchshow:boolean;
  hastag:string = '';
  level:string = '';
  price;
  typeSearch:string ="";
  public coursehastags = ['C', 'C#', 'C++', 'Java','Html/css','Python','IOS/Android','AI','Javascript','Machine Learning','UX/UI','Framework','Orther'];
  public courselevels = ['Basic', 'Tutorial','Advance','Deep Learning','Guide'];
  constructor(
    private cartService: CartService,
    private router: Router,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private accountincourseService: AccountincourseService,
    private imageLoadService: ImageloadService,private notificationService: NotificationService,
    private datePipe: DatePipe, public dialog: MatDialog
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
        this.cartService.addToCart({course,quantity:1});
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
        this.courseService.transferToCourseDataset(e,this.courseDataSet,this.isContentToggled);
        })
      }
      else{
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].accountId == this.currentAccount.accountId) {
            list.splice(i, 1);
          }
        }
        list.forEach(e => {
          this.courseService.transferToCourseDataset(e,this.courseDataSet,this.isContentToggled);
        })
      }
    }
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
  public onSearch() {
    this.router.navigate(['/search'], {queryParams: {name: this.namesearch,option : 0, accountId : 0, price: this.price, hastag:this.hastag,level:this.level,typeSearch:this.typeSearch}});
  }
  async buyFreeCourse(course){
    var invoiceCode = "";
    invoiceCode =  await this.accountincourseService.createInvoice(this.currentAccount.accountId,course.courseId,true,"Account Balance",invoiceCode,false,this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss'));
    await this.accountincourseService.createInvoice(course.accountId,course.courseId,false,"Account Balance",invoiceCode,true,this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss'));
    this.notificationService.showNotification("This course have been add to your course libary","Buy success",1500);
    this.router.navigateByUrl('invoicehistory'); 
  }
  toggleContent(index) {
    this.courseDataSet[index].course.description = this.isContentToggled[index] ? this.courseDataSet[index].nonFormatedDescription : this.courseService.formatContent(this.courseDataSet[index].nonFormatedDescription);
  }
  updateState(){
    this.dialog.open(FiltersearchComponent, {
      width: '400px', 
      data: {
        namesearch: this.namesearch,price: this.price, hastag:this.hastag,level:this.level
      }
    });
  }
}
