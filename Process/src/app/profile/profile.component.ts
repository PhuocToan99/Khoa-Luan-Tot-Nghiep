import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../model/user';
import { Account } from '../model/Account';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

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
  currentAccount: Account;
  // dialogData: Array<DialogData>
  // users: Array<User>
  constructor(private service: UserService, private accService: AuthenticationService, private chRef: ChangeDetectorRef,private http: HttpClient,private datePipe: DatePipe, private router: Router) {
    this.accService.currentAccount.subscribe(x => this.currentAccount = x);
    if( this.currentAccount == null ) this.router.navigate(['/login']);
   }

  async ngOnInit(): Promise<void> {
    // await this.load();
    await this.getuser();
  }
  // private load = async () => {
  //   // this.users = new Array<User>();
  //   this.dataset = await this.getuser();
  // }
  public getuser = async () => {
        //var account = await this.service.getaccount(this.currentAccount.accountId);
        if(this.currentAccount.role == "instructor"){
          this.haveBalance = true;
        }
        //console.log(account);
        if(this.currentAccount != undefined){
        let user = await this.service.getuser(this.currentAccount.userId) as User;
        this.haveAvatar = true;
        user.account = this.currentAccount;
        this.user = user;
        }
      return this.user;
    }
  public getaccount= async (id) => {
    const list = await this.service.getaccounts() as Account[];
    if (list) {
    for(let i=0;i<list.length;i++){
      if(list[i].userId == id){
        return list[i];
      }
    }
  }
}
getImageMime(base64: string): string
  {
    if (base64.charAt(0)=='/') return 'jpg';
    else if (base64.charAt(0)=='R') return "gif";
    else if(base64.charAt(0)=='i') return 'png';
    else return 'jpeg';
  }
  getImageSource(base64: string): string
  {
    return `data:image/${this.getImageMime(base64)};base64,${base64}`; 
  }
  // private reload = async () => {
  //   this.users = new Array<User>();
  //   this.dataset = await this.getusers();
  // }
  // openDialog(id): void {
  //   const user = this.users.find((user) => user.userId === id);
  //   // console.log(this.accService.currentAccountValue.id);
  //   // console.log(user);
  //   const dialogRef = this.dialog.open(DialogupdateuserComponent, {
  //     width: '400px',
  //     data: {
  //       id: this.ID, firstName: this.FirstName, lastName: this.LastName, sex: this.Sex, doB: this.DoB, email: this.Email, phone: this.Phone, country: this.Country, userName: this.Username, password: this.Password, role: this.Role,
  //       accountId: this.AccountID
  //     }
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result.id != null) {
  //       console.log('The dialog was closed');
  //       result.doB = this.convertDateTimeCSharp(result.doB);
  //       console.log(result);
  //       this.updateUser(result);
  //     }
  //     this.reload();
  //   });
  // }
  // pushData(id): void {
  //   console.log(id);
  //   const user = this.user;
  //   this.ID = id;
  //   this.FirstName = user.firstName,
  //   this.LastName = user.lastName,
  //   this.Gender = user.gender,
  //   this.CreatedDate= user.createdDate,
  //   this.Email = user.email,
  //   this.PhoneNumber = user.phoneNumber,
  //   this.AvatarPath = user.avatarPath,
  //   this.Balance = user.balance
  // }
  reload= async () =>{
    this.accService.currentAccount.subscribe(x => this.currentAccount = x);
    await this.getuser(); 
    console.log(this.user.account.username);
  }
  update = async() =>{
    this.LastLogOnDate= this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    console.log(this.user);
    console.log(this.FirstName+" "+this.LastName+" "+this.Email+" "+this.Username);
    if(this.FirstName != null || this.LastName != null || this. Email !=null || this.PhoneNumber != null){
      try 
      {
        const formData: FormData = new FormData();
        if(this.FirstName != null){
        // user.firstName = this.FirstName;
        this.user.firstName = this.FirstName;
        }
        if(this.LastName != null){
        // user.lastName = this.LastName;
        this.user.lastName = this.LastName;
        }
        if(this.Email != null){
        // user.email = this.Email;
        this.user.email = this.Email;
        }
        if(this.PhoneNumber != null){
        // user.phoneNumber = this.Phone;
        this.user.phoneNumber = this.PhoneNumber;
        }
        formData.append('userId',this.currentAccount.userId.toString());
        formData.append('firstName',this.user.firstName);
        formData.append('lastName',this.user.lastName);
        formData.append('email',this.user.email);
        formData.append('avatarPath',this.user.avatarPath);
        formData.append('phoneNumber',this.user.phoneNumber);
        formData.append('balance',this.user.balance.toString());
        formData.append('createdDate',(this.user.createdDate).toString());
        formData.append('lastLogOnDate',(this.LastLogOnDate).toString());
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
}
