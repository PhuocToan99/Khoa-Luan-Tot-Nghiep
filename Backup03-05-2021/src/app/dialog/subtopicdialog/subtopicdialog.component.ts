import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subtopic } from '../../model/subtopic';
import { Topic } from '../../model/topic';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-subtopicdialog',
  templateUrl: './subtopicdialog.component.html',
  styleUrls: ['./subtopicdialog.component.css']
})
export class SubtopicdialogComponent implements OnInit {
  private urlAPI = "https://localhost:44387/api/Topics";
  topics: Topic[];
  public CourseId;
  mess: string;
  constructor(public dialogRef: MatDialogRef<SubtopicdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Subtopic, private httpClient: HttpClient) {
      if(data.subTopicTitle == ""){
        this.mess = "Add Subtopic Detail";
      }
      else{
        this.mess = "Edit Subtopic Infomation";
      }
     }

  ngOnInit(): void {
    this.topics = [];
    this.httpClient.get(this.urlAPI).subscribe((data: Topic[])=>{
      let courseInfo = localStorage.getItem("course");
      let savedCourse = JSON.parse(courseInfo);
      this.CourseId = parseInt(savedCourse.courseId);
      for (var i=0;i<data.length;i++){
      if(data[i].courseId == this.CourseId){
        this.topics.push(data[i]);
      }
      }
      // console.log(this.topics);
    });
  }
}
