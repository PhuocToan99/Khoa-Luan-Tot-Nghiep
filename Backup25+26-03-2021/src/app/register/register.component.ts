import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { DatePipe } from '@angular/common';
import { Account } from '../model/Account';
import { SignupService } from '../services/signup.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 //Two way binding
 public FirstName: string;
 public LastName: string;  
 public UserGender: string;   
 public genders = ['Nam', 'Nữ','Khác']
 public Email: string;
 public PhoneNumber: string;
 public AvatarPath;
 public CreatedDate;
 public LastLogOnDate;
 public Balance: number= 0.0;
 public UserId;
 public Username:string;
 public Password:string;
 public Role: string = ''
 public Active: boolean;
 public phoneInvalid: boolean = true;
 public firstNameInvalid: boolean = true;
 public lastNameInvalid: boolean = true;
 public emailInvalid: boolean = true;
constructor(private router: Router, private userservice: UserService,private datePipe: DatePipe,private service: SignupService) {
  this.CreatedDate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
  this.LastLogOnDate= datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
  this.loadScripts();
}

ngOnInit(): void {
}
handleFileInput(files: FileList) {
  console.log(files.item(0));
  if (files.item(0))
    this.AvatarPath = files.item(0);  //Lấy file uplload hình gán vào biến
}
base64ToBlob(base64: string, type: string) 
{
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  } 
  return new Blob([bytes], { type: type });
};
public createNewUser = async () => {
  try {
    if(this.emailInvalid == false || this.firstNameInvalid == false || this.lastNameInvalid == false || this.phoneInvalid == false || this.UserGender ==""){
      alert("Invalid user information!");
    }
    else{
    let user = new User();
    user.firstName = this.FirstName;
    user.lastName = this.LastName;
    user.gender = this.UserGender;
    user.email = this.Email;
    user.phoneNumber = this.PhoneNumber;
    user.avatarPath = this.AvatarPath;
    user.createdDate = this.CreatedDate;
    user.lastLogOnDate = this.LastLogOnDate;
    user.balance = this.Balance;
    const result2 = await this.userservice.postuser(user);
    console.log(result2);
    localStorage.setItem("user", JSON.stringify(result2));
    this.reload();
    }
  }
  catch (e) {
    alert('Register failed');
  }
};
public reload(){
  let userInfo = localStorage.getItem("user");
  let savedUser = JSON.parse(userInfo);
  this.UserId = parseInt(savedUser.UserId);
}
public createNewAccount = async () => {
  try {
    let userInfo = localStorage.getItem("user");
    let savedUser = JSON.parse(userInfo);
    let account = new Account();
    if(this.Password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*?[#?!@$%^&*-])/) && this.Password.length >=8){
    account.username = this.Username;
    account.password = this.Password;
    account.role = "user";
    account.isActive = true;
    account.userId = savedUser.userId;
    const result = await this.service.addAccount(account) as any;
    if(result != null){
    alert('Register sucessfully');  
    this.router.navigateByUrl('/login');
    }
    else{
      alert("Username already exist.Please choose another one")
    }
    }
    else{
      alert("Password must have least 8 characters,1 uppercase letter and 1 special character");
    }
  }
  catch (e) {
    alert('Register failed');
  }
}
public loadScripts() {
  var script = "assets/js/register.js";
    const node = document.createElement('script');
    node.src = script;
    node.type = 'text/javascript';
    node.async = false;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
}
checkPhonenumber(){
  if(this.PhoneNumber.match(/^[0-9]+$/) && this.PhoneNumber.length >= 6){
   return this.phoneInvalid = true;
  }
  return this.phoneInvalid = false;
}
checkFirstName(){
  if(this.FirstName.match(/^[A-Za-z ]+$/) && this.FirstName.length >= 1){
    return this.firstNameInvalid = true;
    }
    return this.firstNameInvalid = false;
}
checkLastName(){
  if(this.LastName.match(/^[A-Za-z ]+$/) && this.LastName.length >= 1){
    return this.lastNameInvalid = true;
    }
    return this.lastNameInvalid= false;
}
checkEmail(){
  var result = this.Email.slice(-10);
  if(result == "@gmail.com"){
    return this.emailInvalid = true;
    }
    return this.emailInvalid= false;
}
}
