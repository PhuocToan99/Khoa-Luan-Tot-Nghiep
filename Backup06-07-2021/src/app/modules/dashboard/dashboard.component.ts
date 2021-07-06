import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { MatDialog } from '@angular/material/dialog';
import { Account } from '../../model/Account';
import { CourseService } from '../../services/course.service';
import { CourseData } from '../../model/course';
import * as moment from 'moment';
export class ChartData{
  hasTag: String[];
  rate: number[];
}
export class Data{
  name: String;
  y: number;
}
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
  displayedColumns: string[] = ['courseName','hastag', 'price', 'startDate'];
  
  public course : CourseData[] = [];
  public dataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private dashboardService: DashboardService,private userService: UserService, public dialog: MatDialog,private courseService:CourseService) { 

  }
  async ngOnInit(){
    this.bigChart = this.dashboardService.bigChart();
    this.cards = this.dashboardService.cards();
    this.pieChart = await this.pieChartData();
    await this.load();
    this.dataSource = new MatTableDataSource<CourseData>(this.course)
    this.dataSource.paginator = this.paginator;
    console.log(this.pieChart);
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
    this.course = await this.courseService.gettopcourse() as CourseData[];
    this.course.forEach(e => {
      e.startDate = (moment(e.startDate)).format('DD/MM/YYYY HH:mm:ss')
    });
  }
  async pieChartData() {
    var result:ChartData = new ChartData();
    result.hasTag = [];
    result.rate = [];
    result = await this.courseService.getHastagChartData() as ChartData;
    return [{
      name: result.hasTag[0],
      y: result.rate[0]
    }, {
      name: result.hasTag[1],
      y: result.rate[1]
    }, {
      name: result.hasTag[2],
      y: result.rate[2]
    }, {
      name: result.hasTag[3],
      y: result.rate[3]
    }, {
      name: result.hasTag[4],
      y: result.rate[4]
    }, {
      name: result.hasTag[5],
      y: result.rate[5]
    },
    {
      name: result.hasTag[6],
      y: result.rate[6]
    },
    {
      name: result.hasTag[7],
      y: result.rate[7]
    }
  ,{
    name: result.hasTag[8],
    y: result.rate[8]
  },
  {
    name: result.hasTag[9],
    y: result.rate[9]
  },
  {
    name: result.hasTag[10],
    y: result.rate[10]
  },
  {
    name: result.hasTag[11],
    y: result.rate[11]
  },
  {
    name: result.hasTag[12],
    y: result.rate[12],
    sliced: true,
    selected: true
  }];
  }
}

