import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { CourseService } from '../services/course.service';
import { Course } from '../model/course';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from '../model/Account';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import {CartService} from "../services/cart.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ImageloadService } from '../services/imageload.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  namesearch;
  public courses : Course[] = [];
  public login = false;
  currentAccount: Account;
  public itembuy : AccountInCourse[];
  constructor(config: NgbCarouselConfig, private router: Router,private courseService:CourseService, private authenticationService: AuthenticationService,  private accountincourseService:AccountincourseService,private cartService:CartService, private route: ActivatedRoute,private imageLoadService:ImageloadService) {
    // customize default values of carousels used by this component tree
    config.interval = 2000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      if(this.currentAccount){
        this.login = true;
      }
      if(this.currentAccount && this.currentAccount.role == "admin"){
        this.router.navigateByUrl('admin/dashboard');
      }
  }
  async ngOnInit(): Promise<void> {
    await this.load();
  } 
  public onSearch = async () => {
    console.log(this.namesearch);
    this.router.navigate(['/search'], {queryParams: {name: this.namesearch}});
  }
  public load = async () => {
    this.itembuy = [];
    this.courses = [];
    this.itembuy = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
    const list = await this.courseService.gettopcourse() as Course[];
    if(this.currentAccount){
      for(let i = 0; i< list.length;i++){
        if(list[i].accountId != this.currentAccount.accountId){
        this.courses.push(list[i]);
        }
      }
    }
    else{
      this.courses = list;
    }
  }
  coursealreadybought(id){
    if(this.currentAccount == undefined || this.currentAccount == null){
      return false;
    }
    var find;
    if(this.currentAccount){
    if (this.itembuy) {
      find = this.itembuy.find(e => e.accountId == this.currentAccount.accountId && e.courseId == id);
    }
    }
    return (find != null && find != undefined) ? true : false;
  }
  public loadimage(url){
    return this.imageLoadService.getImageSource(url);
  }
  addToCart = (course) => {
    this.cartService.addToCart({course,quantity:1})
};
viewdetail = async (id) =>  {
  this.router.navigate(['/category',id], { relativeTo: this.route });
}
}
