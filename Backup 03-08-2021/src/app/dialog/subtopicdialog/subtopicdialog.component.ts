import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SubtopicDialogData } from '../shared/sharedata';
import { Topic } from '../../model/topic';
import { TopicService } from '../../services/topic.service'
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-subtopicdialog',
  templateUrl: './subtopicdialog.component.html',
  styleUrls: ['./subtopicdialog.component.css']
})
export class SubtopicdialogComponent implements OnInit {
  topics: Topic[] = [];
  public CourseId;
  mess: string;
  constructor(public dialogRef: MatDialogRef<SubtopicdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubtopicDialogData, private topicService: TopicService) {
      if(data.subTopicTitle == ""){
        this.mess = "Add Subtopic Detail";
      }
      else{
        this.mess = "Edit Subtopic Infomation";
      }
     }

  async ngOnInit() {
    this.topics = await this.topicService.gettopicsbycourseid(this.data.courseId) as Topic[];
  }
}
