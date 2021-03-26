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
  selector: 'app-managepublishcourse',
  templateUrl: './managepublishcourse.component.html',
  styleUrls: ['./managepublishcourse.component.css']
})
export class ManagepublishcourseComponent implements OnInit {

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
    }

  ngOnInit(): void {
    this.load();
  }
  private load = async () => {
    this.courses = new Array<Course>();
    var datasets: Course[];
    datasets = await this.service.getcourses() as Course[];
    for (let i = datasets.length -1; i >= 0 ; i--) {
      if(datasets[i].accountId != this.currentAccount.accountId){
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
  viewdetail = async (id) =>  {
    this.router.navigate(['/category',id], { relativeTo: this.route });
  }

public loadimage(url){
  return this.imageLoadService.getImageSource(url);
}

}
