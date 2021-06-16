import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AccountInCourse } from '../model/accountincourse';
import { Account } from '../model/Account';
import { AccountincourseService } from '../services/accountincourse.service';
import { Course } from '../model/course';
import { AuthenticationService } from '../services/authentication.service';
import { CourseService } from '../services/course.service';
import { ImageloadService } from '../services/imageload.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InvoicedialogComponent } from '../dialog/invoicedialog/invoicedialog.component';
export class DataInfo {
  invoice: AccountInCourse;
  course: Course;
}
@Component({
  selector: 'app-invoicehistory',
  templateUrl: './invoicehistory.component.html',
  styleUrls: ['./invoicehistory.component.css']
})
export class InvoicehistoryComponent implements OnInit {
  displayedColumns: string[] = ['invoiceCode', 'courseInfo', 'price', 'createDate', 'paymentMethod'];
  dataSource: DataInfo[] = [];
  public currentAccount: Account;
  invoiceCodeList: string[] = [];
  createDateList: string[] = [];
  totalCourse: string[] = [];
  payMethodList: string[] = [];
  totalPrice: string[] = [];
  constructor(private accountInCourseService: AccountincourseService, private authencationService: AuthenticationService,
    private courseService: CourseService, private imageService: ImageloadService, private chRef: ChangeDetectorRef,
    private datePipe: DatePipe, public dialog: MatDialog) {
    this.authencationService.currentAccount.subscribe(x => this.currentAccount = x);
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  async ngOnInit() {
    await this.loadpage();
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [4, 8, 12],
      autoWidth: true,
      processing: true
    };
    this.chRef.detectChanges();
    this.dtTrigger.next();
  }
  async loadpage() {
    var invoiceInstructorlist: AccountInCourse[] = [];
    var invoiceList = await this.accountInCourseService.getaccountincoursesByAccountId(this.currentAccount.accountId, 1) as AccountInCourse[];
    console.log(this.currentAccount);
    console.log(invoiceList);
    if (this.currentAccount.role == "instructor") invoiceInstructorlist = await this.accountInCourseService.getaccountincoursesByAccountId(this.currentAccount.accountId, 2) as AccountInCourse[];
    if (invoiceInstructorlist) {
      invoiceInstructorlist.forEach(e => invoiceList.push(e));
    }
    for (var i = 0; i < invoiceList.length; i++) {
      var data: DataInfo = new DataInfo();
      data.course = await this.courseService.getcourse(invoiceList[i].courseId) as Course;
      if (data.course.isActive == true) {
        data.invoice = invoiceList[i];
        data.course.price = (data.course.accountId == this.currentAccount.accountId) ? data.course.price * 0.8 : data.course.price;
        this.dataSource.push(data);
      }
      else {
        continue;
      }
    }
    console.log(this.dataSource);
    await this.getInvoiceList();
    this.chRef.detectChanges();
  }
  loadimage(src) {
    return this.imageService.getImageSource(src);
  }

  getInvoiceList() {
    console.log(this.dataSource);
    if (this.dataSource.length > 0) {
      var invoiceCode = "";
      for (var i = 0; i < this.dataSource.length; i++) {
        if (i == 0) {
          invoiceCode = this.dataSource[i].invoice.invoiceCode;
          this.savedata(invoiceCode);
        }
        else {
          if (this.dataSource[i].invoice.invoiceCode != invoiceCode) {
            invoiceCode = this.dataSource[i].invoice.invoiceCode;
            this.savedata(invoiceCode);
          }
        }
      }
    }
  }
  savedata(invoiceCode) {
    var creadate = "";
    var courseCount = 0;
    var price = 0;
    var payment = "";
    var index = 0;
    var result = this.dataSource.filter(e => e.invoice.invoiceCode == invoiceCode);
    result.forEach(e => {price += e.course.price, courseCount++});
    creadate = this.dateFormat(result[index].invoice.createdDate);
    this.createDateList.push(creadate);
    invoiceCode = result[index].invoice.invoiceCode;
    this.invoiceCodeList.push(invoiceCode);
    payment = result[index].invoice.paymentMethod;
    this.payMethodList.push(payment);
    this.totalCourse.push(courseCount.toString());
    this.totalPrice.push(price.toString());
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
    return month + " " + re[0] + ", " + re[2];
  }
  async openInvoiceDialog(element, index) {
    console.log(element);
    var flag = this.dataSource.find(e => e.course.accountId == this.currentAccount.accountId && e.invoice.getPayment == true) ? true : false;
    const dialogRef = this.dialog.open(InvoicedialogComponent, {
      data: {
        invoiceCode: element, createDate: this.createDateList[index], totalCourse: this.totalPrice[index], payMethod: this.payMethodList[index],
        currentAccount: this.currentAccount, isBought: true, isInfo: false, isInstructor: flag
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
