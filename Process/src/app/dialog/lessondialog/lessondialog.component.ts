import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subtopic } from '../../model/subtopic';
import { Lesson } from '../../model/lesson';
import { Topic } from '../../model/topic';
import { SubtopicService } from '../../services/subtopic.service';
import { TopicService } from '../../services/topic.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-lessondialog',
  templateUrl: './lessondialog.component.html',
  styleUrls: ['./lessondialog.component.css']
})
export class LessondialogComponent implements OnInit {
  private urlAPI = "https://localhost:44387/api/SubTopics";
  private urlAPITopic = "https://localhost:44387/api/Topics";
  subtopics: Subtopic[];
  topics: Topic[];
  public CourseId;
  constructor(public dialogRef: MatDialogRef<LessondialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lesson, private httpClient: HttpClient,private topicservice: TopicService,
    private subtopicservice: SubtopicService) {
      let courseInfo = localStorage.getItem("course");
      let savedCourse = JSON.parse(courseInfo);
      this.CourseId = parseInt(savedCourse.courseId);
    }

  async ngOnInit(){
    await this.loadtopic();
    // console.log(this.topics);
    await this.loadsubtopic();
    // console.log(this.subtopics);
  }
  public loadtopic= async () =>{
    const list = await this.topicservice.gettopics() as Topic[];
    for (var i=list.length - 1;i >= 0;i--){
      if(list[i].courseId != this.CourseId){
             list.splice(i,1);
      } 
    }
    return this.topics = list;
  }
  public loadsubtopic = async () =>{
  this.httpClient.get(this.urlAPI).subscribe((data: Subtopic[])=>{
  //   console.log(this.topics);
  //  console.log(data);
   var flag = false;
   for (var k = data.length - 1; k >= 0 ;k--){
      for(var i= 0;i < this.topics.length;i++ ){
        flag = false;
        if(this.topics[i].topicId == data[k].topicId){
          flag = true;
          break;
        }
      }
      if(flag != true){
        data.splice(k,1);
      }
    }
    return this.subtopics = data;
  });
  }      
}
