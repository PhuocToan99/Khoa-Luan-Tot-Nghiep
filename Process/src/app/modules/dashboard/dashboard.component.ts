import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import {  MatPaginator } from '@angular/material/paginator';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/user';
import { MatDialog } from '@angular/material/dialog';
import { Account } from '../../model/Account';
import { CourseService } from '../../services/course.service';
import { Course } from '../../model/course';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  bigChart = [];
  cards = [];
  pieChart = [];
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
  public userCount;
  public instructorCount;
  public totalBalance:number;
  public totalExpenditure:number;
  public totalRevenue:number;
  public result: string;
  public result1 :string;
  displayedColumns: string[] = ['courseName', 'price', 'startDate', 'hastag'];
  
  public course : Course[] = [];
  public dataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private dashboardService: DashboardService,private service: UserService, private accService: AuthenticationService, public dialog: MatDialog,private courseService:CourseService) { 

  }
  async ngOnInit(): Promise<void> {
    this.bigChart = this.dashboardService.bigChart();
    this.cards = this.dashboardService.cards();
    this.pieChart = this.dashboardService.pieChart();
    await this.load();
    //console.log(this.course);
    this.dataSource = new MatTableDataSource<Course>(this.course)
    this.dataSource.paginator = this.paginator;
  } 
  public load = async () => {
    this.totalBalance = 0.0;
    this.totalExpenditure = 0.0;
    this.totalRevenue = 0.0;
    const list = await this.service.getusers() as User[];
    this.userCount = list.length;
    var count = 0;
    if (list) {
      for (let i = 0; i < list.length; i++) {
        var account = await this.getaccount(list[i].userId);
        if(account != undefined && account.role == "admin"){
        this.totalRevenue += Number(list[i].balance);
        }
        if(account != undefined && account.role == "instructor" && account.isActive == true){
          count++;
        }
        else{
          continue;
        }
      }
    this.totalExpenditure = this.totalRevenue * 4;
    this.result = this.totalExpenditure.toFixed(3);
    this.totalBalance = this.totalRevenue * 5;
    this.result1 = this.totalRevenue.toFixed(3);
    this.instructorCount = count;
    const list1 = await this.courseService.gettopcourse() as Course[];
    for(let i = 0; i< list1.length;i++){
      this.course.push(list1[i]);
    }
  }
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
}
