import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { SearchService } from '../services/search.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { CourseService } from '../services/course.service';
import {CartService} from "../services/cart.service";
import { ImageloadService } from '../services/imageload.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  currentAccount: Account;
  public login = false;
  constructor(private authenticationService: AuthenticationService,private service:SearchService, 
              private router: Router, private route: ActivatedRoute, private accountincourseService:AccountincourseService,  private courseService: CourseService, private cartService:CartService,private imageLoadService:ImageloadService) { 
                this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
                if(this.currentAccount != null){
                  this.login = true;
                }
              }
  name = '';
  option;
  accountId;
  bool = true;
  courses; 
  items: Course[] = [];
  public  p: number = 1;
  public itembuy : AccountInCourse[];
  async ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.name = params["name"] || null;
      this.option = params["option"];
      this.accountId = params["accountId"];
    });
      this.itembuy = (this.currentAccount) ? await this.accountincourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[] : [];
    if (this.name == null){
      this.items = await this.courseService.getcourses() as Course[];
    }
    else {
      this.search(this.name,this.option,this.accountId);
    }
  }
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0,  
    });
  }
  namesearch;
  async onSearch(namesearch){
    this.items = [];
    if (namesearch == null){
      this.items = await this.courseService.getcourses() as Course[];
    }
    else {
      this.search(namesearch,0,0);
    }
  }
  public search(name,option,accountId) {
      this.courses = this.service.getsearchcourse(name,option,accountId).subscribe(
        (data) => {
          if (data != null) {
            this.items = []
            this.items = data;
            this.bool = false;
          }
          else {
            this.bool = true;
          }
        }
      )
      console.log(this.items);
  }
  public loadimage(url){
    return this.imageLoadService.getImageSource(url);
  }
  coursealreadybought(id)  {
    if(this.currentAccount == undefined || this.currentAccount == null){
      return false;
    }
    var find;
    if(this.currentAccount){
    if (this.itembuy) {
      find = this.itembuy.find(e => e.courseId == id);
    }
    else{
      return false;
    }
    }
    return (!find) ? true : false;
  }
  addToCart = (course) => {
    this.cartService.addToCart({course,quantity:1})
  };
  viewdetail = async (id,course) =>  {
    await this.courseService.updatecourseviewcount(id,course);
    this.router.navigate(['/category',id], { relativeTo: this.route });
  }
}
