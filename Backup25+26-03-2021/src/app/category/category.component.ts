import { Component, OnInit } from '@angular/core';
import { CartService } from "../services/cart.service";
import { CourseService } from '../services/course.service';
import { Course } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from '../model/Account';
import { ImageloadService } from '../services/imageload.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
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
  public course: Course;
  currentAccount: Account;
  public itembuy: AccountInCourse[];
  public login = false;
  public p: number = 1;
  constructor(
    private cartService: CartService,
    private router: Router,
    private service: CourseService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private accountincourseService: AccountincourseService,
    private imageLoadService: ImageloadService
  ) {
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    if (this.currentAccount) {
      this.login = true;
    }
    this.getbuyitem();
  }
  async ngOnInit() {
    await this.load();
  }
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
    });
  }
  addToCart = (course) => {
    this.cartService.addToCart({ course, quantity: 1 })
  };
  public loadimage(url) {
    return this.imageLoadService.getImageSource(url);
  }
  private load = async () => {
    // this.dataset = await this.service.getcourses() as Course[];
    const list = await this.service.getcourses() as Course[];
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].accountId == this.currentAccount.accountId) {
          list.splice(i, 1);
        }
      }
    }
    this.dataset = list;
  }
  viewdetail = async (id) => {
    this.router.navigate(['/category', id], { relativeTo: this.route });
  }
  getbuyitem = async () => {
    this.itembuy = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
  }
  coursealreadybought(id) {
    if (this.currentAccount) {
      if (this.itembuy) {
        for (let i = this.itembuy.length - 1; i >= 0; i--) {
          if (this.itembuy[i].accountId == this.currentAccount.accountId && this.itembuy[i].courseId == id) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
