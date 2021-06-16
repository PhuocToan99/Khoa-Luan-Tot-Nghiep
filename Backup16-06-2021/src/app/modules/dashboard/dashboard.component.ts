import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
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
  users: User[] = [];
  accounts: Array<Account>
  isEdit: boolean;
  dialogUser: User;

  public dataset: User[]
  public accountdataset: Account[] = [];
  public userCount: number = 0;
  public instructorCount:number = 0;
  public totalBalance:number = 0;
  public totalExpenditure:number = 0;
  public totalRevenue:number = 0;
  public result: string;
  public result1 :string;
  displayedColumns: string[] = ['courseName', 'price', 'startDate', 'hastag'];
  
  public course : Course[] = [];
  public dataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private dashboardService: DashboardService,private userService: UserService, public dialog: MatDialog,private courseService:CourseService) { 

  }
  async ngOnInit(){
    this.bigChart = this.dashboardService.bigChart();
    this.cards = this.dashboardService.cards();
    this.pieChart = this.dashboardService.pieChart();
    await this.load();
    this.dataSource = new MatTableDataSource<Course>(this.course)
    this.dataSource.paginator = this.paginator;
  } 
  async load(){
    this.totalBalance = 0.0;
    this.totalExpenditure = 0.0;
    this.totalRevenue = 0.0;
    this.accountdataset = await this.userService.getaccounts() as Account[];
    if (this.accountdataset) {
      for (let i = 0; i < this.accountdataset.length; i++) {
        var user = await this.userService.getUserByAccountId(this.accountdataset[i].accountId) as User;
        if(this.accountdataset[i].role == "admin"){
        this.totalRevenue += user.balance;
        }
        if(this.accountdataset[i].role == "instructor" && this.accountdataset[i].isActive == true){
          this.totalExpenditure += user.balance;
          this.instructorCount++;
          this.userCount ++;
        }
        else{
          this.userCount ++;
          continue;
        }
      }
    }
    this.totalExpenditure += this.totalRevenue;
    this.result = this.totalExpenditure.toFixed(3);
    this.totalBalance = this.totalRevenue;
    this.result1 = this.totalRevenue.toFixed(3);
    this.course = await this.courseService.gettopcourse() as Course[];
  }
}

