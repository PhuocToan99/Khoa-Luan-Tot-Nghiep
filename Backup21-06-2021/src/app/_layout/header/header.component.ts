import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { Account } from  '../../model/Account';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public collapse: boolean = false;
  public cart_num:number;
  public isCollapsed = true;
  public username:string = '';
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  currentAccount: Account;
  public flag: Boolean = false;
  constructor( private cartService: CartService,public location: Location, private router: Router,
    private authenticationService: AuthenticationService) { 
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
      this.flag = (this.currentAccount) ? true : false;
      this.username = (this.flag) ? this.currentAccount.username : ""; 
  }
  get isUser() {
    if(this.currentAccount != null){
      return true;
    }
    return false;
  }
  ngOnInit(): void {
    this.cartService.cartListSubject
    .subscribe(res => {
        this.cart_num = res.length;
    });
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
         if (event.url != this.lastPoppedUrl)
             this.yScrollStack.push(window.scrollY);
     } else if (event instanceof NavigationEnd) {
         if (event.url == this.lastPoppedUrl) {
             this.lastPoppedUrl = undefined;
             window.scrollTo(0, this.yScrollStack.pop());
         } else
             window.scrollTo(0, 0);
     }
   });
   this.location.subscribe((ev:PopStateEvent) => {
       this.lastPoppedUrl = ev.url;
   });
  }
  toggleCartPopup = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.toggleCart()
  }
  public onLogout = () => {
    this.username = '';
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }   
  public onLogin = () => {
    this.router.navigate(['/login']);
  }
  public onRegister = () => {
    this.router.navigate(['/register']);
  } 
  get isInstructor() {
    if(this.currentAccount.role == "instructor"){
      return true;
    }
    return false;
  }
  get isNormalUser() {
    if(this.currentAccount.role == "user"){
      return true;
    }
    return false;
  }
}
