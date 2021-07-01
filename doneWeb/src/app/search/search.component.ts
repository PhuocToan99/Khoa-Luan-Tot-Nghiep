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
import { MatDialog } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FiltersearchComponent } from '../dialog/filtersearch/filtersearch.component';
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
              private datePipe: DatePipe,private notificationService: NotificationService, public dialog: MatDialog) { 
                this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
                this.login = (this.currentAccount) ? true : false;
              }
  name = '';
  option:number;
  accountId;
  bool = true;
  courses; 
  items: Course[] = [];
  public  p: number = 1;
  public itembuy : AccountInCourse[];
  myControl = new FormControl();
  options: CourseDataSet[] = [];
  filteredOptions: Observable<CourseDataSet[]>;
  hastag:string = '';
  level:string = '';
  typeSearch:string = '';
  price;
  searchshow:boolean;
  public coursehastags = ['C', 'C#', 'C++', 'Java','Html/css','Python','IOS/Android','AI','Javascript','Machine Learning','UX/UI','Framework','Orther'];
  public courselevels = ['Basic', 'Tutorial','Advance','Deep Learning','Guide'];
  async ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.name = params["name"] || null;
      this.option = params["option"];
      this.accountId = params["accountId"];
      this.hastag = params["hastag"] || "";
      this.level = params["level"] || "";
      this.price = params["price"] || "";
      this.typeSearch = params["typeSearch"];
    });
    console.log(this.typeSearch);
      this.itembuy = (this.currentAccount) ? await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[] : [];
      if(this.typeSearch == "normal" || this.typeSearch == "" || this.typeSearch == undefined){
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
      if(this.typeSearch == "advance"){
        this.onSearch();
      }
     
    const list = await this.courseService.getcourses() as Course[];
    var optionCourseDataSet:CourseDataSet[] = [];
    for(let i = 0; i< list.length;i++){
      if(list[i].accountId != this.currentAccount.accountId){
        var courseData: CourseDataSet = new CourseDataSet();
        courseData.course = list[i];
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
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0,  
    });
  }
  namesearch:string = "";
  async onSearch(){
    this.courseDataSet = [];
    if(this.typeSearch == "normal" || this.typeSearch == ""){
    if (this.namesearch == null){
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
        this.search(this.namesearch,0,0);
    }
  }
  if(this.typeSearch == "advance"){
    this.name = (this.name) ? this.name : '';
    this.courses = await this.courseService.getCourseFilter(this.hastag,this.name,this.price,this.level) as Course[];
        if (this.courses != null) {
          this.courseDataSet = [];
          this.items = this.courses;
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
  toggleContent(index) {
    this.courseDataSet[index].course.description = this.isContentToggled[index] ? this.courseDataSet[index].nonFormatedDescription : this.formatContent(this.courseDataSet[index].nonFormatedDescription);
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }
  updateState(){
    const dialogRef =this.dialog.open(FiltersearchComponent, {
      width: '400px', 
      data: {
        namesearch: this.namesearch,price: this.price, hastag:this.hastag,level:this.level
      }
    });
    dialogRef.afterClosed().subscribe(async result => {
      this.name = result.namesearch;
      this.price= (result.price != '0') ? result.price : '';
      this.hastag = this.coursehastags.indexOf(result.hastag).toString();
      this.level= result.level;
      this.typeSearch = "advance";
      await this.onSearch();
    });
  }
}
