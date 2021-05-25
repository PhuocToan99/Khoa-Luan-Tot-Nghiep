import { CartBaseComponent } from "./cart-base.component";
import { CartService } from "../services/cart.service";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from '../model/Account';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
// import { Course } from '../model/course';
import { CourseService } from '../services/course.service';
import { ImageloadService } from '../services/imageload.service';
import { DatePipe } from '@angular/common';
declare var paypal;
@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent extends CartBaseComponent {
  currentAccount: Account;
  data = [];
  public valid: boolean = true;
  public paypal: boolean = false;
  invoiceCode: string = "";
  public currentUser: User = new User();
  public userName: string = "";
  public adminName:string ="";
  public date: string = "";
  public adminUser:User = new User();
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  constructor(protected cartService: CartService, private router: Router, private accountincourseService: AccountincourseService, private authenticationService: AuthenticationService,
    private userService: UserService, private courseService: CourseService, private imageLoadService: ImageloadService, private datePipe: DatePipe) {
    super(cartService);
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    this.paypal = false;
    this.invoiceCode = this.makeid(8);
  }
  paidFor = false;
  async ngOnInit() {
    this.currentUser = await this.userService.getUserByAccountId(this.currentAccount.accountId) as User;
    this.userName = this.currentUser.firstName + " " + this.currentUser.lastName;
    var admin = await this.userService.getAccountByRole("admin", null) as Account[];
    console.log(admin);
    this.adminUser = await this.userService.getuser(admin[0].accountId) as User;
    console.log(this.adminUser);
    this.adminName = this.adminUser.firstName +" "+this.adminUser.lastName;
    this.date = this.dateFormat();
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: "Checkout",
                amount: {
                  currency_code: 'USD',
                  value: this.totalPrice
                }
              }
            ]
          })

        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          this.paypalpayment();
        },
        onError: err => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);

  }
  changeQuantity = (cart, quantity) => {
    cart.quantity = quantity;
    this.cartService.reloadCart(this.cartList);
  }
  public loadimage(url) {
    return this.imageLoadService.getImageSource(url);
  }
  pushdata = async (paymethod) => {

    for (let index = 0; index < this.cartList.length; index++) {
      var accountInCourse: AccountInCourse = new AccountInCourse();
      //console.log(this.currentAccount.accountId);
      accountInCourse.accountId = this.currentAccount.accountId;
      accountInCourse.courseId = this.cartList[index].course.courseId;
      accountInCourse.isBought = true;
      accountInCourse.paymentMethod = paymethod;
      accountInCourse.invoiceCode = this.invoiceCode;
      accountInCourse.createdDate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      this.accountincourseService.postaccountincourse(accountInCourse);
      this.data.push(accountInCourse);
    }
    const list = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
  }
  // userAdmin: User = new User;
  instructor: User = new User;
  async paypalpayment() {
    // var admin = await this.userService.getAccountByRole("admin", null) as Account[];
    // this.userAdmin = await this.userService.getUserByAccountId(admin[0].accountId) as User;
    // console.log(this.userAdmin);
    try {
      for (var i = 0; i < this.cartList.length; i++) {
        this.instructor = await this.userService.getUserByAccountId(this.cartList[i].course.accountId) as User;
        console.log(this.instructor);
        let number2 = this.instructor.balance;
        let number3 = this.adminUser.balance
        let number: number = this.cartList[i].course.price * 0.8;
        let number1: number = this.cartList[i].course.price - number;
        console.log(number, number1, number2, number3, number + number2, number1 + number3);
        this.instructor.balance += number;
        console.log(this.instructor)
        await this.userService.updateusers(this.instructor.userId, this.instructor);
        this.adminUser.balance += number1;
        console.log(this.adminUser);
        await this.userService.updateusers(this.adminUser.userId, this.adminUser);
        // var course = await this.courseService.getcourse(this.cartList[i].course.accountId) as Course;
        // course.numberOfParticipants++;
        // await this.courseService.updatecourses(course.courseId,course);  
      }
      this.pushdata("Paypal");
      this.cartService.emtyCart(this.cartList);
      alert('Pay success');
      this.router.navigateByUrl('invoicehistory');
    }
    catch (e) {
      console.log(e);
    }
  }
  async balancepayment() {
    if (this.currentAccount.role == "user") {
      var r = confirm("Do you want to become an instructor?");
      if (r) {
        this.router.navigate(['becomeinstructor']);
      }
    }
    else {
      // var user = await this.userService.getUserByAccountId(this.currentAccount.accountId) as User;
      // console.log(user);
      if (this.currentUser.balance < this.totalPrice) {
        alert("Not enough money in your balance");
      }
      else {
        // var admin = await this.userService.getAccountByRole("admin", null) as Account[];
        // console.log(admin);
        // var userAdmin = await this.userService.getuser(admin[0].accountId) as User;
        // console.log(userAdmin);
        try {
          for (var i = 0; i < this.cartList.length; i++) {
            var instructor = await this.userService.getUserByAccountId(this.cartList[i].course.accountId) as User;
            console.log(instructor);
            instructor.balance += this.cartList[i].course.price * 0.8;
            await this.userService.updateusers(instructor.userId, instructor);
            this.currentUser.balance -= this.cartList[i].course.price;
            await this.userService.updateusers(this.currentUser.userId, this.currentUser);
            this.adminUser.balance += this.cartList[i].course.price * 0.2;
            await this.userService.updateusers(this.adminUser.userId, this.adminUser);
            // var course = await this.courseService.getcourse(this.cartList[i].course.accountId) as Course;
            // course.numberOfParticipants++;
            // await this.courseService.updatecourses(course.courseId,course);  
          }
          this.pushdata("Account Balance");
          this.cartService.emtyCart(this.cartList);
          alert('Pay success');
          this.router.navigateByUrl('invoicehistory');
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  }
  makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() *
        charactersLength)));
    }
    return result.join('');
  }
  dateFormat() {
    let date = this.datePipe.transform(Date.now(), 'dd-MM-yyyy');
    // var month;
    var re = date.split("-");
    switch (re[1]) {
      case "01":
        var month = "January";
        break;
      case "02":
        var month = "February";
        break;
      case "03":
        var month = "March";
        break;
      case "04":
        var month = "	April";
        break;
      case "05":
        var month = "May";
        break;
      case "06":
        var month = "June";
        break;
      case "07":
        var month = "July";
        break;
      case "08":
        var month = "August";
        break;
      case "09":
        var month = "September";
        break;
      case "10":
        var month = "October";
        break;
      case "11":
        var month = "November";
        break;
      case "12":
        var month = "December";
        break;
    }
    console.log(re[0] + " " + re[1] + " " + re[2]);
    return month + " "+re[0]+", "+re[2];
  }
}
