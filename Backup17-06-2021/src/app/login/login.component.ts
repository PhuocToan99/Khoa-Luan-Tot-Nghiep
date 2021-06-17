import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username;
  public password;

  a:boolean;
  constructor( private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
  }
  login(){
    this.authenticationService.login(this.username, this.password).subscribe(
      (data) => {
        if(data == null){
          alert("Wrong username or password");
        }
        this.a = data.isActive;
        if (this.a) {
          if (data != null && data.username) {
            localStorage.setItem('username', data.username);
            localStorage.setItem('password', data.password);
            console.log('Login Success');
            if (this.authenticationService.currentAccountValue.role != "admin"){
              this.router.navigateByUrl('');
            }
            else{
              this.router.navigateByUrl('admin/dashboard'); 
            }

          }
        }
        else {
          this.authenticationService.logout();
            alert('You have been banned');
        }
      },
      (error) => console.error(error)
    )
  }
}
