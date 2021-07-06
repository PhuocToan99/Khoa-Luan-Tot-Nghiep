import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Cart} from "../model/cart";
import {AccountincourseService} from "../services/accountincourse.service";
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { AccountInCourse } from  '../model/accountincourse';
@Injectable({
  providedIn: 'root'
})
export class CartService {
    public currentAccount: Account;
    public cartList:Cart[] = [];
    constructor(private authencationService: AuthenticationService,private accountInCourseService: AccountincourseService) {
        this.authencationService.currentAccount.subscribe(x => this.currentAccount = x);
    }
    public cartListSubject = new BehaviorSubject([]);
    public toggleCartSubject = new BehaviorSubject(false);
    toggleCart = async () => {
        this.toggleCartSubject.next(!this.toggleCartSubject.getValue());
    };
    addToCart = async (cart:Cart) => {
        let current = this.cartListSubject.getValue();
        let dup = current.find(c=>c.course.courseId === cart.course.courseId);
        if(!dup) {
          current.push(cart);
          let accountInCourse = new AccountInCourse();
          accountInCourse.accountId = this.currentAccount.accountId;
          accountInCourse.courseId = cart.course.courseId;
          accountInCourse.isCart = true;
          await this.accountInCourseService.postCart(accountInCourse);
        }
        this.loadCart();
    };
    reloadCart = (cartList) => {
        this.cartListSubject.next(cartList);
    };
    emtyCart = (cartList) => {
        cartList =[];
        this.cartListSubject.next(cartList);
    };
    removeCart = async index => {
        let current = this.cartListSubject.getValue();
        this.cartListSubject
        .subscribe(res => {
            console.log(res);
            this.cartList = res;
        });
        await this.accountInCourseService.deleteCart(this.currentAccount.accountId,this.cartList[index].course.courseId);
        current.splice(index,1);
        this.cartListSubject.next(current);
    };
    async loadCart(){
        this.emtyCart(this.cartListSubject);
        var result = await this.accountInCourseService.getCart(this.currentAccount.accountId) as Cart[];
        this.cartListSubject.next(result);
    }
}
