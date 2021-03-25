import { Component, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/user';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Account } from '../../model/Account';
import { CourseService } from '../../services/course.service';
import { Course } from '../../model/course';
export interface CourseData {
  name: string;
  course: Course;
}
@Component({
  selector: 'app-managecourse',
  templateUrl: './managecourse.component.html',
  styleUrls: ['./managecourse.component.css']
})
export class ManagecourseComponent implements OnInit {
  public coursedata: CourseData[] = [];
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  constructor(private service: UserService, private accService: AuthenticationService, public dialog: MatDialog, private chRef: ChangeDetectorRef,private courseService:CourseService) { }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
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
  public load = async () => {
    const list = await this.courseService.getallcourses() as Course[];
   //const list1 = await this.service.getusers() as User[];
    if (list) {
      for (let i = 0; i < list.length; i++) {     
        const account = await this.service.getaccount(list[i].accountId) as Account;
        const user = await this.service.getuser(account.userId) as User;
          if(user){
            this.coursedata.push({name: user.lastName,course: list[i]});
          }
    }
    //console.log(this.coursedata);
  }
  }
  async checkCheckBoxvalue(event,course: Course){
    //console.log(event.target.checked+" "+account);
    if(event.target.checked == false){
      await this.deactiveCourse(course); 
    }
    if(event.target.checked == true){
        await this.activeCourse(course);
    }
  }
  async deactiveCourse(course: Course) {
    var r = confirm("Are you sure you want to deactive this course?");
    if (r) {
      course.isActive = false;
      await this.courseService.updatecourses(course.courseId, course);
      // await this.reload();
      await this.rerender();
      //window.location.reload;
    }
  }
  async activeCourse(course: Course) {
    var r = confirm("Are you sure you want to active this course?");
    if (r) {
      course.isActive = true;
      await this.courseService.updatecourses(course.courseId, course);
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
}
