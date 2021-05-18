import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subtopic } from '../../model/subtopic';
import { LessonDialogData } from '../shared/sharedata';
import { Topic } from '../../model/topic';
import { SubtopicService } from '../../services/subtopic.service';
@Component({
  selector: 'app-lessondialog',
  templateUrl: './lessondialog.component.html',
  styleUrls: ['./lessondialog.component.css']
})
export class LessondialogComponent implements OnInit {
  subtopics: Subtopic[];
  mess: string;
  constructor(public dialogRef: MatDialogRef<LessondialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LessonDialogData,private subtopicService: SubtopicService) {
      if(data.lessonTitle == ""){
        this.mess = "Add Lesson Detail";
      }
      else{
        this.mess = "Edit Lesson Infomation";
      }
    }

  async ngOnInit(){
    await this.loadsubtopic();
    // console.log(this.subtopics);
  }
  public loadsubtopic = async () =>{
    this.subtopics = await this.subtopicService.getSubtopicsByCourseId(this.data.courseId) as Subtopic[];
  }      
}
