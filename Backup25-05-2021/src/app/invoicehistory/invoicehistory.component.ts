import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { AccountInCourse } from '../model/accountincourse';
import { Account } from '../model/Account';
import { AccountincourseService } from '../services/accountincourse.service';
import {Course} from '../model/course';
import { AuthenticationService } from '../services/authentication.service';
import { CourseService } from '../services/course.service';
import { ImageloadService } from '../services/imageload.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { InvoicedialogComponent } from '../dialog/invoicedialog/invoicedialog.component';
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
  constructor(private accountInCourseService:AccountincourseService,private authencationService: AuthenticationService,
    private courseService: CourseService,private imageService:ImageloadService, private chRef: ChangeDetectorRef, private datePipe: DatePipe,public dialog: MatDialog) { 
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
      creadate = this.dateFormat(this.dataSource[0].invoice.createdDate);
      
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
          // creadate = this.dataSource[i].invoice.createdDate;
          creadate = this.dateFormat(this.dataSource[i].invoice.createdDate);
          this.createDateList.push(creadate);
          this.payMethodList.push(payment);
          this.invoiceCodeList.push(invoiceCode);
        }
      }
    }
  }
  dateFormat(date) {
    let day = this.datePipe.transform(date, 'dd-MM-yyyy');
    // var month;
    var re = day.split("-");
    switch (re[1]) {
      case "01":
        var month = "January";
        break;
      case "02":
        var month = "February";
        break;
      case "03":
        var month = "March";
        break;
      case "04":
        var month = "	April";
        break;
      case "05":
        var month = "May";
        break;
      case "06":
        var month = "June";
        break;
      case "07":
        var month = "July";
        break;
      case "08":
        var month = "August";
        break;
      case "09":
        var month = "September";
        break;
      case "10":
        var month = "October";
        break;
      case "11":
        var month = "November";
        break;
      case "12":
        var month = "December";
        break;
    }
    console.log(re[0] + " " + re[1] + " " + re[2]);
    return month + " "+re[0]+", "+re[2];
  }
  openInvoiceDialog(index){
    const dialogRef = this.dialog.open(InvoicedialogComponent, {
      width: '40%',
      height: '85vh',
      data: {  invoiceCode: this.invoiceCodeList[index],createDate:this.createDateList[index],totalCourse:this.totalCourse,payMethod:this.payMethodList[index],totalPrice:this.totalPrice,
        currentAccount:this.currentAccount,isBought:true,isInfo: false}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
