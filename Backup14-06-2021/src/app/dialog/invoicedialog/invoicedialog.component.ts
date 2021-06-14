import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { InvoiceDialogData } from '../shared/sharedata';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountincourseService } from '../../services/accountincourse.service';
import {Course} from '../../model/course';
import { AccountInCourse } from '../../model/accountincourse';
import { CourseService } from '../../services/course.service';
import { ImageloadService } from '../../services/imageload.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
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
  public currentUser: User = new User();
  public userName:string ="";
  public adminName:string="";
  public dataSource:DataInfo[] =[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: InvoiceDialogData,private userService:UserService, private accountInCourseService:AccountincourseService,
  private courseService: CourseService,private imageService:ImageloadService) { 
    console.log(this.data);
    this.loadpage();
  }

  async ngOnInit() {
    this.currentUser = await this.userService.getUserByAccountId(this.data.currentAccount.accountId) as User;
    this.userName = this.currentUser.firstName + " " + this.currentUser.lastName;
  }
  public invoiceInfo:DataInfo[] = [];
  public invoiceTotalPrice : number = 0;
  async loadpage(){
    var invoiceList = (this.data.isInstructor == false) ? 
    await this.accountInCourseService.getaccountincoursesByInvoiceCode(1,this.data.invoiceCode) as AccountInCourse[] :
    await this.accountInCourseService.getaccountincoursesByInvoiceCode(2,this.data.invoiceCode) as AccountInCourse[];
    console.log(invoiceList);
    for(var i = 0;i<invoiceList.length;i++){
      var data:DataInfo = new DataInfo();
      data.invoice = invoiceList[i];
      data.course = await this.courseService.getcourse(invoiceList[i].courseId) as Course;
      console.log(data.course);
      data.course.price = (this.data.currentAccount.role =="instructor" && this.data.currentAccount.accountId == data.course.accountId) ? data.course.price*0.8 : data.course.price;
      this.dataSource.push(data);
    }
    for(var i=0;i<this.dataSource.length;i++){
      if(this.dataSource[i].invoice.invoiceCode == this.data.invoiceCode){
        this.invoiceInfo.push(this.dataSource[i]);
        this.invoiceTotalPrice += this.dataSource[i].course.price;
      }
    }
  }
  loadimage(src){
    return this.imageService.getImageSource(src);
  }
  buyCourse(){
    this.data.isInfo = false;
  }
  exportAsPDF(divId)
  {
      let data = document.getElementById('export');  
      html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
      var fileName = "Invoice" + this.data.invoiceCode +".pdf";
      pdf.save(fileName);   
    }); 
  }
}
