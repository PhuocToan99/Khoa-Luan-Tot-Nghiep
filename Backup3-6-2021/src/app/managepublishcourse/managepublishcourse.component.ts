import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountInCourse } from '../model/accountincourse';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { ImageloadService } from '../services/imageload.service';
@Component({
  selector: 'app-managepublishcourse',
  templateUrl: './managepublishcourse.component.html',
  styleUrls: ['./managepublishcourse.component.css']
})
export class ManagepublishcourseComponent implements OnInit {
  public dataset: Course[] =[];
  public course: Course;
  currentAccount: Account;
  public itembuy : AccountInCourse[];
  public  p: number = 1;
  constructor(private router: Router,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private imageLoadService:ImageloadService,
    private chRef: ChangeDetectorRef) { 
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      if( this.currentAccount == null ) this.router.navigate(['/login']);
    }

  ngOnInit(): void {
    this.load();
  }
  private load = async () => {
    this.dataset = await this.courseService.getCourseByAccountId(this.currentAccount.accountId) as Course[];
  }
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0,  
    });
  }
  viewdetail = async (id) =>  {
    this.router.navigate(['/category',id], { relativeTo: this.route });
  }

public loadimage(url){
  return this.imageLoadService.getImageSource(url);
}
public editCourse(course:Course){
  localStorage.setItem("course", JSON.stringify(course));
  localStorage.setItem('isEditedCourse', "1");
  this.router.navigate(['/addcoursedetail'], { relativeTo: this.route });
}
namesearch;
async onSearch(){
  console.log(this.namesearch);
  if(this.namesearch == null || this.namesearch == undefined || this.namesearch == ""){
    this.load();
  }
  else{
    this.dataset = await this.courseService.getCourseSearch(this.namesearch,2,this.currentAccount.accountId) as Course[];
    this.chRef.detectChanges();
  }
}
}
