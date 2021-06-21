import { Component, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CourseService } from '../../services/course.service';
import { Course } from '../../model/course';
import { NotificationService } from '../../services/notification.service';
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
  constructor(private service: UserService, public dialog: MatDialog, private chRef: ChangeDetectorRef,private courseService:CourseService,private notificationService: NotificationService) { }
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
    if (list) {
      for (let i = 0; i < list.length; i++) {     
            const user = await this.service.getUserByAccountId(list[i].accountId) as User;
            this.coursedata.push({name: user.firstName +" "+user.lastName,course: list[i]});
    }
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
      await this.courseService.updatecourses(course);
      this.notificationService.showDeleteNotification("This course have been deactive","Deactive success",3000);
      // await this.reload();
      await this.rerender();
      //window.location.reload;
    }
  }
  async activeCourse(course: Course) {
    var r = confirm("Are you sure you want to active this course?");
    if (r) {
      course.isActive = true;
      await this.courseService.updatecourses(course);
      this.notificationService.showNotification("This course have been active","Active success",3000);
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
