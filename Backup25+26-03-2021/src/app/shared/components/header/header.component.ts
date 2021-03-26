import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import { Account } from  '../../../model/Account';
@Component({
  selector: 'app-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  public isCollapsed = true;
  private show = true;
  public username:string = '';
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  // @Input() role = '';
  // @Input() button = '';
  currentAccount: Account;
  constructor(public location: Location, private router: Router,
    private authenticationService: AuthenticationService) { 
      console.log(this.show);
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    }
  ngOnInit(): void {
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
  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
  public onLogout = () => {
    this.username = '';
    this.show = false;
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }  
}
