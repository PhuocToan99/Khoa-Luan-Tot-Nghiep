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
      if(!this.currentAccount){
        this.router.navigateByUrl('/login');
      }
    }

  async ngOnInit(){
    this.currentAccount = await this.userService.getaccount(this.currentAccount.accountId) as Account;
  }
  public upToInstructor = async () => {
    try{
    await this.userService.upToInstructor(this.currentAccount.accountId,this.currentAccount);
    var account = await this.userService.getaccount(this.currentAccount.accountId) as Account;
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
