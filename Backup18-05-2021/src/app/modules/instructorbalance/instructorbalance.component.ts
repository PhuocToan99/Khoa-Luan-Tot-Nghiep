import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/user';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Account } from '../../model/Account';
@Component({
  selector: 'app-instructorbalance',
  templateUrl: './instructorbalance.component.html',
  styleUrls: ['./instructorbalance.component.css']
})
export class InstructorbalanceComponent implements OnInit {
  users: Array<User>
  accounts: Array<Account>
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
  accountList:Account[] = [];
  constructor(private service: UserService, private accService: AuthenticationService, public dialog: MatDialog, private chRef: ChangeDetectorRef) {
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  async ngOnInit(): Promise<void> {

    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthMenu: [4, 8, 12],
      autoWidth: true
    };

    await this.reload();
    this.chRef.detectChanges();
    this.dtTrigger.next();
  }
  private reload = async () => {
    this.users = new Array<User>();
    this.dataset = await this.getusers();
  }
  public getusers = async () => {
    const list = await this.service.getusers() as User[];
    this.accountList = await this.service.getAccountByRole("instructor",null) as Account[];
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
}
