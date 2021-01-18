import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../services/products.service";
import {Product} from "../model/product";
import {CartService} from "../services/cart.service";
import { CourseService } from '../services/course.service';
import { Course } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
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
  public dataset: Course[]
  public products:Array<Product>;
  public course: Course;
  currentAccount: Account;
  public itembuy : AccountInCourse[];
  public login = false;
    private sub;
  public  p: number = 1;
    constructor(
         private productService:ProductsService,
         private cartService:CartService,
         private router: Router,
         private service: CourseService,
         private route: ActivatedRoute,
         private authenticationService: AuthenticationService,
         private accountincourseService:AccountincourseService
    ) {
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      if(this.currentAccount){
        this.login = true;
      }
      this.getbuyitem();
     }
    async ngOnInit() {
        this.load();
        await this.reload();
    }
    load = () => {
       this.sub = this.productService.getProducts('https://localhost:44387/api/Courses')
            .subscribe(res => {
                this.products = res;
            })
    };
    gotoTop() {
      window.scroll({ 
        top: 0, 
        left: 0,  
      });
    }
    addToCart = (course) => {
        this.cartService.addToCart({course,quantity:1})
    };
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    getImageMime(base64: string): string
    {
      if (base64.charAt(0)=='/') return 'jpg';
      else if (base64.charAt(0)=='R') return "gif";
      else if(base64.charAt(0)=='i') return 'png';
      else return 'jpeg';
    }
    getImageSource(course: Course): string
    {
      return `data:image/${this.getImageMime(course.thumbnailImage)};base64,${course.thumbnailImage}`; 
    }
    private reload = async () => {
      this.courses = new Array<Course>();
      this.dataset = await this.getcourses();
    }
    public getcourses = async () => {
      const list = await this.service.getcourses() as Course[];
      if (list) {
        for (let i = 0; i < list.length; i++) {
          let course = new Course();
          course.courseName = list[i].courseName;
          course.rating = list[i].rating;
          course.numberOfParticipants = list[i].numberOfParticipants;
          course.price = list[i].price;
          course.startDate = list[i].startDate;
          course.courseDuration = list[i].courseDuration;
          course.description = list[i].description;
          course.thumbnailImage = list[i].thumbnailImage;
          course.hastag = list[i].hastag;
          course.level = list[i].level;
          course.lastUpdate = list[i].lastUpdate;
          this.courses.push(course);
        }
        return list;
      }
    }
    viewdetail = async (id) =>  {
      this.router.navigate(['/category',id], { relativeTo: this.route });
    }
    getbuyitem = async () =>{
      this.itembuy = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
    }
    coursealreadybought(id)  {
      if(this.currentAccount){
      if (this.itembuy) {
        for (let i = this.itembuy.length - 1; i >= 0; i--) {
          if(this.itembuy[i].accountId == this.currentAccount.accountId && this.itembuy[i].courseId == id){
            return false;
          }
        } 
      }
      }
      return true;
    }
}
