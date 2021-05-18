import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/user';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Account } from '../../model/Account';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css']
})
export class ManageuserComponent implements OnInit {
  users: Array<User>
  accounts: Array<Account>
  //nap du lieu cho nay
  settings: Object
  //Two way binding
  public ID: string = ''
  public FirstName: string = ''
  public LastName: string = ''
  public Sex: string = ''
  public DoB: Date
  public Email: string = ''
  public Phone: string = ''
  public Country: string = ''
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
  public isChecked : boolean = true;
  accountList: Account[] = [];
  constructor(private service: UserService, private accService: AuthenticationService, public dialog: MatDialog, private chRef: ChangeDetectorRef,private notificationService: NotificationService) {
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  async ngOnInit(): Promise<void> {

    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [4, 8, 12],
      autoWidth: true
    };

    await this.load();
    this.chRef.detectChanges();
    this.dtTrigger.next();
  }
  private load = async () => {
    this.users = new Array<User>();
    this.dataset = await this.getusers();
  }
  public getusers = async () => {
    const list = await this.service.getusers() as User[];
    this.accountList = await this.service.getAccountByRole("user","instructor") as Account[];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        var account = this.accountList.find(account => account.userId === list[i].userId) as Account;
        if(account != undefined){
          let user = new User();
          user.firstName = list[i].firstName;
          user.lastName = list[i].lastName;
          user.phoneNumber = list[i].phoneNumber;
          user.createdDate = list[i].createdDate;
          user.lastLogOnDate = list[i].lastLogOnDate;
          user.email = list[i].email;
          user.balance= list[i].balance;
          user.gender = list[i].gender;
        user.account = account;
        this.users.push(user);
        }
        else{
          continue;
        }
      }
      return list;
    }
  }
async blockUser(account: Account) {
  var r = confirm("Are you sure you want to block this user?");
  if (r) {
    account.isActive = false;
    await this.service.updateaccount(account.accountId, account);
    this.notificationService.showDeleteNotification("User account have been banned","Block success",3000);
    // await this.reload();
    await this.rerender();
    //window.location.reload;
  }
}
async unBlockUser(account: Account) {
  var r = confirm("Are you sure you want to unblock this user?");
  if (r) {
    account.isActive = true;
    await this.service.updateaccount(account.accountId, account);
    this.notificationService.showNotification("User account have been unclock","Unblock success",3000);
    await this.rerender();
    //window.location.reload;
  }
}
rerender() {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    this.dtTrigger.next();
  });
}
async checkCheckBoxvalue(event,account: Account){
  //console.log(event.target.checked+" "+account);
  if(event.target.checked == false){
    await this.blockUser(account); 
  }
  if(event.target.checked == true){
      await this.unBlockUser(account);
  }
}
}
