import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { AccountInCourse } from '../model/accountincourse';
import { User } from '../model/user';
import { Account } from '../model/Account';
import { AccountincourseService } from '../services/accountincourse.service';
import { UserService } from '../services/user.service';
import {Course} from '../model/course';
import { AuthenticationService } from '../services/authentication.service';
import { CourseService } from '../services/course.service';
import { ImageloadService } from '../services/imageload.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { element } from 'protractor';
export class DataInfo {
  invoice: AccountInCourse;
  course:Course;
}
@Component({
  selector: 'app-invoicehistory',
  templateUrl: './invoicehistory.component.html',
  styleUrls: ['./invoicehistory.component.css']
})
export class InvoicehistoryComponent implements OnInit {
  displayedColumns: string[] = ['invoiceCode', 'courseInfo','price', 'createDate', 'paymentMethod'];
  public dataSource:DataInfo[] =[];
  public currentAccount: Account;
  public adminUser:User = new User();
  public currentUser: User = new User();
  public userName:string ="";
  public adminName:string="";
  constructor(private userService:UserService, private accountInCourseService:AccountincourseService,private authencationService: AuthenticationService,
    private courseService: CourseService,private imageService:ImageloadService, private chRef: ChangeDetectorRef) { 
    this.authencationService.currentAccount.subscribe(x => this.currentAccount = x);
    console.log(this.currentAccount);
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  async ngOnInit() {
    await this.loadpage();
    this.getInvoiceList();
    this.currentUser = await this.userService.getUserByAccountId(this.currentAccount.accountId) as User;
    this.userName = this.currentUser.firstName + " " + this.currentUser.lastName;
    var admin = await this.userService.getAccountByRole("admin", null) as Account[];
    console.log(admin);
    this.adminUser = await this.userService.getuser(admin[0].accountId) as User;
    console.log(this.adminUser);
    this.adminName = this.adminUser.firstName +" "+this.adminUser.lastName;
    console.log(this.dataSource);
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [4, 8, 12],
      autoWidth: true
    };
    this.chRef.detectChanges();
    this.dtTrigger.next();
  }
  async loadpage(){
    var invoiceList = await this.accountInCourseService.getaccountincoursesByAccountId(this.currentAccount.accountId) as AccountInCourse[];
    for(var i = 0;i<invoiceList.length;i++){
      var data:DataInfo = new DataInfo();
      data.invoice = invoiceList[i];
      data.course = await this.courseService.getcourse(invoiceList[i].courseId) as Course;
      this.dataSource.push(data);
    }
  }
  loadimage(src){
    return this.imageService.getImageSource(src);
  }
  public invoiceInfo:DataInfo[] = [];
  public invoiceTotalPrice : number = 0;
  show:boolean = false;
  showInvoice(invoiceCode){
    console.log(invoiceCode);
    this.show = !this.show;
    if(this.show){
      this.dataSource.forEach(e => {if(e.invoice.invoiceCode == invoiceCode){
        this.invoiceInfo.push(e);
        this.invoiceTotalPrice += e.course.price;
      }});
    }
    console.log(this.invoiceTotalPrice);
    this.chRef.detectChanges();
  }
  invoiceCodeList: string[] = [];
  createDateList:string[] = [];
  totalCourse:string[] = [];
  payMethodList:string[] = [];
  totalPrice:string[] = [];
  getInvoiceList(){
    var invoiceCode = "";
    var creadate = "";
    var courseCount = 0;
    var price = 0;
    var payment ="";
    if(this.dataSource.length != 0){
      creadate = this.dataSource[0].invoice.createdDate;
      this.createDateList.push(creadate);
      invoiceCode = this.dataSource[0].invoice.invoiceCode;
      this.invoiceCodeList.push(invoiceCode);
      payment = this.dataSource[0].invoice.paymentMethod;
      this.payMethodList.push(payment);
      courseCount++;
      price+= this.dataSource[0].course.price;
      this.totalCourse.push(courseCount.toString());
      this.totalPrice.push(price.toString());
      for(var i = 1;i< this.dataSource.length ;i++){
        courseCount++;
        price+= this.dataSource[i].course.price;
        if(this.dataSource[i].invoice.invoiceCode != invoiceCode){
          this.totalCourse.push(courseCount.toString());
          this.totalPrice.push(price.toString());
          courseCount = 0;
          courseCount ++;
          price= 0;
          price+= this.dataSource[i].course.price;
          invoiceCode = this.dataSource[i].invoice.invoiceCode;
          payment = this.dataSource[i].invoice.paymentMethod;
          creadate = this.dataSource[i].invoice.createdDate;
          this.createDateList.push(creadate);
          this.payMethodList.push(payment);
          this.invoiceCodeList.push(invoiceCode);
        }
      }
    }
    console.log(this.invoiceCodeList);
    console.log(this.payMethodList);
    console.log(this.createDateList);
    console.log(this.totalPrice);
    console.log(this.totalCourse);
  }
}
