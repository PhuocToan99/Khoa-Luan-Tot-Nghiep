import { Component, OnInit, Inject } from '@angular/core';
import { FilterCourseDialogData } from '../shared/sharedata';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Course,CourseDataSet } from '../../model/course';
import {FormControl} from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-filtersearch',
  templateUrl: './filtersearch.component.html',
  styleUrls: ['./filtersearch.component.css']
})
export class FiltersearchComponent implements OnInit {
  public courseDataSet:CourseDataSet[] = [];
  myControl = new FormControl();
  public coursehastags = ['C', 'C#', 'C++', 'Java','Html/css','Python','IOS/Android','AI','Javascript','Machine Learning','UX/UI','Framework','Orther'];
  public courselevels = ['Basic', 'Tutorial','Advance','Deep Learning','Guide'];
  constructor(public dialogRef: MatDialogRef<FiltersearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterCourseDialogData, private courseService: CourseService, private router: Router) { 
      this.data.hastag = '-1';
    }

  async ngOnInit(){
    await this.load();
  }
  onChange(value,type){
    console.log(value);
    switch(type) { 
      case 'name': { 
         this.data.namesearch = value;
         break; 
      } 
      case 'hastag': { 
        this.data.hastag = value; 
         break; 
      } 
      case 'level': { 
        this.data.level = value; 
         break; 
      }
      case 'price': { 
        this.data.price = value; 
        break; 
      }  
   }
  }
  private load = async () => {
    const list = await this.courseService.getcourses() as Course[];
    if (list) {
        list.forEach(e => {
        var courseData: CourseDataSet = new CourseDataSet();
        courseData.course = e;
        courseData.nonFormatedDescription = e.description;
        courseData.course.description = e.description;
        courseData.rating = Math.floor(e.rating);
        courseData.check = ((e.rating - courseData.rating) >= 0.5) ? true : false;
        this.courseDataSet.push(courseData);
        })
      }
  }
  public onSearch() {
    var hastag = this.coursehastags.indexOf(this.data.hastag);
    this.router.navigate(['/search'], {queryParams: {name: this.data.namesearch,option : 0, accountId : 0, price: this.data.price, hastag:hastag,level:this.data.level,typeSearch:"advance"}});
  }
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }
}
