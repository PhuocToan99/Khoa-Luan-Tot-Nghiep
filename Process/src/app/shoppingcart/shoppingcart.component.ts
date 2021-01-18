import {CartBaseComponent} from "./cart-base.component";
import {CartService} from "../services/cart.service";
import { Course } from '../model/course';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountInCourse } from '../model/accountincourse';
import { AccountincourseService } from '../services/accountincourse.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { UserService } from  '../services/user.service';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { CourseService } from '../services/course.service';
declare var paypal;
@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent extends CartBaseComponent {
  currentAccount: Account;
  private urlAPI = 'https://localhost:44387/api/Users';
  data = [];
  public valid :boolean = true;
  public paypal:boolean = false;
  @ViewChild('paypal', {static:true}) paypalElement : ElementRef;
  constructor(protected cartService: CartService,private router: Router,private accountincourseService:AccountincourseService,private authenticationService: AuthenticationService,private userService:UserService,private http: HttpClient,private courseService: CourseService) {
    super(cartService);
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    this.paypal = false;
   }
   paidFor = false;
  ngOnInit(): void {
     paypal
    .Buttons({
      createOrder:(data,actions) =>{
        return actions.order.create({
          purchase_units:[
            {
              description:"Checkout",
              amount:{
                currency_code:'USD',
                value:this.totalPrice
              }
            }
          ]
        })

      },
      onApprove:async(data,actions) =>{
        const order = await actions.order.capture();
        this.paidFor=true;
       
        alert('Pay success');
        this.paypal = true;
        this.updateUserBalance(this.currentAccount.accountId,this.totalPrice,this.paypal);
        this.updateInstructorBalance();
        this.pushdata();
        this.cartService.emtyCart(this.cartList);
        this.router.navigateByUrl('/');
      },
      onError:err =>{
        console.log(err);
      }
    })
    .render(this.paypalElement.nativeElement);

  }
  changeQuantity = (cart,quantity) => {
    cart.quantity = quantity;
    this.cartService.reloadCart(this.cartList);
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
    pushdata = async () =>{
      for (let index = 0; index < this.cartList.length; index++) {
        var accountInCourse : AccountInCourse = new AccountInCourse();
        //console.log(this.currentAccount.accountId);
        accountInCourse.accountId = this.currentAccount.accountId;
        accountInCourse.courseId = this.cartList[index].course.courseId;
        this.accountincourseService.postaccountincourse(accountInCourse);
        this.data.push(accountInCourse);
      }
      const list = await this.accountincourseService.getaccountincourses() as AccountInCourse[];
    }
    updateUserBalance = async (id,price,flag) => {
      try {
        var account = await this.userService.getaccount(id) as Account;
       // console.log(account);
        var user = await this.userService.getuser(account.userId) as User;
       // console.log(user);
        var money:number = price;
        var money1:number = user.balance;
        var balance:number = money1 - money;
        if(balance < 0){
         this.valid = false;
         if(this.currentAccount.role == "user"){
           if(!flag){
          var r = confirm("Do you want to become an instructor?");
          }
          if (r)
          {
            this.router.navigate(['becomeinstructor']);
          }
         }
         else{
           if(!flag){
          alert("Not enough money in your balance");
          }
         }
        }
        else{
        console.log("Price: "+this.totalPrice);
        console.log(money +" " + money1 +" "+balance);
        const formData: FormData = new FormData();
        formData.append('userId',user.userId.toString());
        formData.append('firstName',user.firstName);
        formData.append('lastName',user.lastName);
        formData.append('createdDate',(user.createdDate).toString());
        formData.append('lastLogOnDate',(user.lastLogOnDate).toString());
        formData.append('email',user.email);
        formData.append('phoneNumber',user.phoneNumber);
        formData.append('gender',user.gender);
        formData.append('avatarPath',user.avatarPath);
        formData.append('balance',balance.toString());
        await this.http.put(this.urlAPI+'/' + account.userId, formData).toPromise();
        var user1 = await this.userService.getuser(31) as User;
        console.log(user1);
        const formData1: FormData = new FormData();
        formData1.append('userId',user1.userId.toString());
        formData1.append('firstName',user1.firstName);
        formData1.append('lastName',user1.lastName);
        formData1.append('createdDate',(user1.createdDate).toString());
        formData1.append('lastLogOnDate',(user1.lastLogOnDate).toString());
        formData1.append('email',user1.email);
        formData1.append('phoneNumber',user1.phoneNumber);
        formData1.append('gender',user1.gender);
        var money3 :number =user1.balance;
        var money4 :number =price * 0.2;
        var balance1 :number = money3 + money4;
        console.log(money3 +" " + money4 +" "+balance1);
        formData1.append('balance',balance1.toString());
        formData1.append('avatarPath',user1.avatarPath);
        await this.http.put(this.urlAPI+'/31', formData1).toPromise();
       }
       if(paypal){
        var user1 = await this.userService.getuser(31) as User;
        console.log(user1);
        const formData1: FormData = new FormData();
        formData1.append('userId',user1.userId.toString());
        formData1.append('firstName',user1.firstName);
        formData1.append('lastName',user1.lastName);
        formData1.append('createdDate',(user1.createdDate).toString());
        formData1.append('lastLogOnDate',(user1.lastLogOnDate).toString());
        formData1.append('email',user1.email);
        formData1.append('phoneNumber',user1.phoneNumber);
        formData1.append('gender',user1.gender);
        var money3 :number =user1.balance;
        var money4 :number =price * 0.2;
        var balance1 :number = money3 + money4;
        console.log(money3 +" " + money4 +" "+balance1);
        formData1.append('balance',balance1.toString());
        formData1.append('avatarPath',user1.avatarPath);
        await this.http.put(this.urlAPI+'/31', formData1).toPromise();
       }
      }
      catch (e) {
        console.log(e);
      }
    }
    updateInstructorBalance = async () => {
      console.log(this.cartList);
      if(this.valid){
      for(var i=0;i<this.cartList.length;i++){
        var courseid = this.cartList[i].course.courseId;
        var course = await this.courseService.getcourse(courseid) as Course;
        var account = await this.userService.getaccount(course.accountId) as Account;
        var user = await this.userService.getuser(account.userId) as User;
        // console.log(course);
        // console.log(account);
        // console.log(user);
        const formData: FormData = new FormData();
        formData.append('userId',user.userId.toString());
        formData.append('firstName',user.firstName);
        formData.append('lastName',user.lastName);
        formData.append('createdDate',(user.createdDate).toString());
        formData.append('lastLogOnDate',(user.lastLogOnDate).toString());
        formData.append('email',user.email);
        formData.append('phoneNumber',user.phoneNumber);
        formData.append('gender',user.gender);
        var money :number = user.balance;
        var money1 :number = course.price * 0.8;
        var balance :number =money + money1;
        console.log(money +" " + money1 +" "+balance);
        formData.append('balance',balance.toString());
        formData.append('avatarPath',user.avatarPath);
        await this.http.put(this.urlAPI+'/' + user.userId, formData).toPromise();
      }
      }
    }
    public balancepayment = async () => {
      try{
        await this.updateUserBalance(this.currentAccount.accountId,this.totalPrice,this.paypal);
        //console.log(this.valid);
        if(this.valid){
        this.updateInstructorBalance();
        this.pushdata();
        this.cartService.emtyCart(this.cartList);
        this.router.navigateByUrl('/');
        alert('Pay success');
        }
      }
      catch(e){
        console.log(e);
        alert("Transaction fail");
      }
    }
}
