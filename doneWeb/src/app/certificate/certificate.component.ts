import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { ImageloadService } from '../services/imageload.service';
import { Account } from '../model/Account';
import { User } from '../model/User';
import { Course } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CertificateService } from '../services/certificate.service';
import { Certificate } from '../model/certificate';
@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  course: Course;
  currentAccount: Account;
  instructor: User;
  id="";
  currentUser:User;
  check:boolean;
  getDate = "";
  complete = "";
  certificate:Certificate[] = [];
  constructor(private authenticationService: AuthenticationService,private activatedroute:ActivatedRoute,
  private courseService:CourseService,private userService:UserService,private imageLoadService:ImageloadService,
  private router: Router,private datePipe: DatePipe,private certificateService:CertificateService) {
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    this.id=this.activatedroute.snapshot.paramMap.get("id");
    this.load();
  }

  ngOnInit(): void {
  }
  async load(){
    this.course = await this.courseService.getcourse(this.id) as Course;
    this.instructor = await this.userService.getUserByAccountId(this.course.accountId) as User;
    this.currentUser = await this.userService.getUserByAccountId(this.currentAccount.accountId) as User;
    let rating = Math.floor(this.course.rating);
    this.check = ((this.course.rating - rating) >= 0.5) ? true : false;
    this.certificate = await  this.certificateService.getCertificateByCourseAccountId(this.currentAccount.accountId,this.id) as Certificate[];
    this.getDate = (this.certificate[0].getDate !="") ? this.datePipe.transform(this.certificate[0].getDate, 'dd/MM/yyyy') : this.datePipe.transform(Date.now(), 'dd/MM/yyyy');
    this.complete = (this.certificate) ? "Completed":"In Process";
  }
  public loadimage(url){
    return this.imageLoadService.getImageSource(url);
  }
  toInfoPage(){
    this.router.navigate(['/profile'], {queryParams: {id: '',isInstructor : ''}});
  }
  viewdetail = async (id,course) => {
    await this.courseService.updatecourseviewcount(id,course);
    this.router.navigate(['/category', id], { relativeTo: this.activatedroute });
  }
}
