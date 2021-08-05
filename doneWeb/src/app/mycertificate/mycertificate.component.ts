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
import { CertificateFullInfo } from '../model/certificate';
@Component({
  selector: 'app-mycertificate',
  templateUrl: './mycertificate.component.html',
  styleUrls: ['./mycertificate.component.css']
})
export class MycertificateComponent implements OnInit {
  course: Course;
  currentAccount: Account;
  instructor: User[] = [];
  currentUser:User;
  check:boolean[] = [];
  complete = [];
  certificate:CertificateFullInfo[] = [];
  constructor(private authenticationService: AuthenticationService,private activatedroute:ActivatedRoute,
    private courseService:CourseService,private userService:UserService,private imageLoadService:ImageloadService,
    private router: Router,private datePipe: DatePipe,private certificateService:CertificateService) {
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      this.load();
    }
  
    ngOnInit(): void {
    }
    async load(){
      this.certificate = await this.certificateService.getAllCertificateByAccountId(this.currentAccount.accountId) as CertificateFullInfo[];
      this.certificate.forEach(async e =>{
        let user = await this.userService.getUserByAccountId(e.course.accountId) as User;
        this.instructor.push(user);
        let rating = Math.floor(e.course.rating);
        let result = ((this.course.rating - rating) >= 0.5) ? true : false;
        this.check.push(result);
        e.getDate = this.datePipe.transform(e.getDate, 'dd/MM/yyyy');
      });
      console.log(this.certificate)
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
    goToCategory(){
      this.router.navigate(['/category'], { relativeTo: this.activatedroute });
    }

}
