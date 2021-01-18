import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-becomeinstructor',
  templateUrl: './becomeinstructor.component.html',
  styleUrls: ['./becomeinstructor.component.css']
})
export class BecomeinstructorComponent implements OnInit {
  currentAccount: Account;
  public flag: Boolean = false;
  constructor(private router: Router,
    private authenticationService: AuthenticationService, private userService : UserService) { 
      this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    }

  ngOnInit(): void {
  }
  public upToInstructor = async () => {
    var account = new Account;
    account.accountId = this.currentAccount.accountId;
    account.isActive = this.currentAccount.isActive;
    account.password = this.currentAccount.password;
    account.role = "instructor";
    account.userId = this.currentAccount.userId;
    account.username = this.currentAccount.username;
    try{
    await this.userService.updateaccount(this.currentAccount.accountId,account);
    alert("You're now Instructor");
    localStorage.setItem('currentAccount', JSON.stringify(account));
    this.authenticationService.currentAccountSubject.next(account);
    this.router.navigate(['']);   
    }
    catch(e){
      console.log(e);
    }
  }
}
