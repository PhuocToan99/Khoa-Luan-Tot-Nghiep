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
                this.getbuyitem();
              }
  name = '';
  bool = true;
  courses; 
  items: Course[] = [];
  public  p: number = 1;
  public itembuy : AccountInCourse[];
  async ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.name = params["name"] || null;
    });
    if (this.name == null){
      this.items = await this.getcourses();
    }
    else {
      this.search(this.name);
      console.log(this.search(this.name));
    }
  }
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0,  
    });
  }
  public onSearch = async () => {
    this.router.navigate(['/search'], {queryParams: {name: this.name}});
  }
  public getcourses = async () => {
    const list = await this.courseService.getcourses() as Course[];
    if (list) {
      return list;
    }
  }
  public search(name) {
      this.courses = this.service.getsearchcourse(name).subscribe(
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
  addToCart = (course) => {
    this.cartService.addToCart({course,quantity:1})
  };
  viewdetail = async (id) =>  {
    this.router.navigate(['/category',id], { relativeTo: this.route });
  }
}
