import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { ImageloadService } from '../services/imageload.service';
@Component({
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.css']
})
export class MycourseComponent implements OnInit {
  courses: Array<Course>
  //nap du lieu cho nay
  settings: Object
  //Two way binding
  public CourseName: string = ''
  public Rating: string = ''
  public NumberOfParticipants: string = ''
  public Price: string = ''
  public StartDate: Date
  public LastUpdate: Date
  public CourseDuration: string = ''
  public Description: string = ''
  public Hastag: string = ''
  public Level: string = ''
  public dataset: Course[];
  public course: Course;
  currentAccount: Account;
  public itembuy : AccountInCourse[];
  public  p: number = 1;
  constructor(private router: Router,
    private service: CourseService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private accountincourseService:AccountincourseService,
    private imageLoadService:ImageloadService) { 
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      if( this.currentAccount == null ) this.router.navigate(['/login']);
      this.getbuyitem();
    }

  ngOnInit(): void {
    this.load();
  }
  private load = async () => {
    this.courses = new Array<Course>();
    var datasets: Course[];
    datasets = await this.service.getcourses() as Course[];
    for (let i = datasets.length -1; i >= 0 ; i--) {
      if(this.coursealreadybought(datasets[i].courseId)){
        datasets.splice(i, 1);
      }
    }
    console.log(datasets);
    this.dataset= datasets;
    console.log(this.dataset);
  }
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0,  
    });
  }
  getbuyitem = async () =>{
    this.itembuy = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
  }
  coursealreadybought(id)  {
    if (this.itembuy) {
      for (let i = this.itembuy.length - 1; i >= 0; i--) {
        if(this.itembuy[i].accountId == this.currentAccount.accountId && this.itembuy[i].courseId == id){
          return false;
        }
      } 
    }
    return true;
  }
  viewdetail = async (id) =>  {
    this.router.navigate(['/category',id], { relativeTo: this.route });
  }

public loadimage(url){
  return this.imageLoadService.getImageSource(url);
}
}
