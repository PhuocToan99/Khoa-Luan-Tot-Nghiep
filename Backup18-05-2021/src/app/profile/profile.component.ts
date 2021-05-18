import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../model/user';
import { Account } from '../model/Account';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ImageloadService } from '../services/imageload.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  accounts: Array<Account>
  settings: Object
  //Two way binding
  public ID: string = ''
  public FirstName: string = ''
  public LastName: string = ''
  public Gender: string = ''
  public CreatedDate: Date
  public Email: string = ''
  public PhoneNumber: string = ''
  public AvatarPath: string = ''
  public Balance: number;
  public LastLogOnDate;
  isEdit: boolean;
  dialogUser: User;

  public dataset: User[]
  public accountdataset: Account[]
  //Two way binding
  public Username:string;
  public Password:string;
  public Role: string = ''
  public Active: boolean;
  public UserId;
  public haveAvatar: boolean = false;
  public haveBalance: boolean = false;
  public phoneInvalid: boolean = true;
  public firstNameInvalid: boolean = true;
  public lastNameInvalid: boolean = true;
  public emailInvalid: boolean = true;
  currentAccount: Account;
  constructor(private service: UserService, private accService: AuthenticationService, private chRef: ChangeDetectorRef,private http: HttpClient,private datePipe: DatePipe, private router: Router,private imageLoadService:ImageloadService) {
    this.accService.currentAccount.subscribe(x => this.currentAccount = x);
    if( this.currentAccount == null ) this.router.navigate(['/login']);
   }

  async ngOnInit(){
    await this.getuser();
  }
  public getuser = async () => {
        if(this.currentAccount.role == "instructor"){
          this.haveBalance = true;
        }
        if(this.currentAccount != undefined){
        let user = await this.service.getuser(this.currentAccount.userId) as User;
        this.haveAvatar = true;
        user.account = this.currentAccount;
        this.user = user;
        }
      console.log(this.user);
      return this.user;
  }
public loadimage(url){
  return this.imageLoadService.getImageSource(this.user.avatarPath);
}
  reload= async () =>{
    this.accService.currentAccount.subscribe(x => this.currentAccount = x);
    await this.getuser(); 
    //console.log(this.user.account.username);
  }
  update = async() =>{
    this.LastLogOnDate= this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    console.log(this.user);
    console.log(this.FirstName+" "+this.LastName+" "+this.Email+" "+this.PhoneNumber);
    if(this.FirstName != null || this.LastName != null || this. Email !=null || this.PhoneNumber != null){
      try 
      {
        const formData: FormData = new FormData();
        if(this.FirstName != ""){
          if(this.firstNameInvalid){
            this.user.firstName = this.FirstName;
            }
            else{
              alert("Invalid Firstname");
            }
        }
        if(this.LastName != ""){
          if(this.firstNameInvalid){
          this.user.lastName = this.LastName;
          }
          else{
            alert("Invalid Lastname");
          }
        }
        if(this.Email != ""){
          if(this.emailInvalid){
            this.user.email = this.Email;
          }
          else{
            alert("Email Invalid");
          }
        }
        if(this.PhoneNumber != ""){
            if(this.phoneInvalid){
            this.user.phoneNumber = this.PhoneNumber;
            }
            else{
              alert("Invalid Phonenumber");
            }
        }
        console.log(this.user);
        formData.append('userId',this.currentAccount.userId.toString());
        formData.append('firstName',this.user.firstName);
        formData.append('lastName',this.user.lastName);
        formData.append('email',this.user.email);
        formData.append('avatarPath',this.user.avatarPath);
        formData.append('phoneNumber',this.user.phoneNumber);
        formData.append('balance',this.user.balance.toString());
        formData.append('createdDate',(this.user.createdDate).toString());
        formData.append('lastLogOnDate',(this.LastLogOnDate).toString());
        formData.append('gender',this.user.gender);
      for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
      }
      await this.http.put('https://localhost:44387/api/Users' + "/" + this.currentAccount.userId, formData).toPromise();
      this.reload();
      }
      catch (e) {
        console.log(e);
      }
    } 
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
