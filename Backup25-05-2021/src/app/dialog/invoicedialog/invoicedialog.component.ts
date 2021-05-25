import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { Account } from '../../model/Account';
import { InvoiceDialogData } from '../shared/sharedata';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountincourseService } from '../../services/accountincourse.service';
import {Course} from '../../model/course';
import { AccountInCourse } from '../../model/accountincourse';
import { CourseService } from '../../services/course.service';
import { ImageloadService } from '../../services/imageload.service';
export class DataInfo {
  invoice: AccountInCourse;
  course:Course;
}
@Component({
  selector: 'app-invoicedialog',
  templateUrl: './invoicedialog.component.html',
  styleUrls: ['./invoicedialog.component.css']
})
export class InvoicedialogComponent implements OnInit {
  public adminUser:User = new User();
  public currentUser: User = new User();
  public userName:string ="";
  public adminName:string="";
  public dataSource:DataInfo[] =[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: InvoiceDialogData,private userService:UserService, private accountInCourseService:AccountincourseService,
  private courseService: CourseService,private imageService:ImageloadService) { 
    this.loadpage();
  }

  async ngOnInit() {
    this.currentUser = await this.userService.getUserByAccountId(this.data.currentAccount.accountId) as User;
    this.userName = this.currentUser.firstName + " " + this.currentUser.lastName;
    var admin = await this.userService.getAccountByRole("admin", null) as Account[];
    console.log(admin);
    this.adminUser = await this.userService.getuser(admin[0].userId) as User;
    console.log(this.adminUser);
    this.adminName = this.adminUser.firstName +" "+this.adminUser.lastName;
  }
  public invoiceInfo:DataInfo[] = [];
  public invoiceTotalPrice : number = 0;
  async loadpage(){
    var invoiceList = await this.accountInCourseService.getaccountincoursesByAccountId(this.data.currentAccount.accountId) as AccountInCourse[];
    for(var i = 0;i<invoiceList.length;i++){
      var data:DataInfo = new DataInfo();
      data.invoice = invoiceList[i];
      data.course = await this.courseService.getcourse(invoiceList[i].courseId) as Course;
      this.dataSource.push(data);
    }
    for(var i=0;i<this.dataSource.length;i++){
      if(this.dataSource[i].invoice.invoiceCode == this.data.invoiceCode){
        this.invoiceInfo.push(this.dataSource[i]);
        this.invoiceTotalPrice += this.dataSource[i].course.price;
      }
    }
    // this.dataSource.forEach(e => {if(e.invoice.invoiceCode == this.data.invoiceCode){
    //   this.invoiceInfo.push(e);
    //   this.invoiceTotalPrice += e.course.price;
    // }});
    console.log(this.invoiceInfo);
  }
  loadimage(src){
    return this.imageService.getImageSource(src);
  }
  buyCourse(){
    this.data.isInfo = false;
  }
}
