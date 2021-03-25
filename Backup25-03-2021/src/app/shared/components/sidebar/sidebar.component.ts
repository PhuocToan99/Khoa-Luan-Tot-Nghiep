import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Account } from  '../../../model/Account';
import { UserService } from  '../../../services/user.service';
import { User } from '../../../model/user';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentAccount: Account;
  public userEmail;
  constructor(private authenticationService: AuthenticationService,private userService:UserService) { 
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
  }

  async ngOnInit() {
    var user = await this.userService.getuser(this.currentAccount.userId) as User;
    this.userEmail = user.email;
  }

}
