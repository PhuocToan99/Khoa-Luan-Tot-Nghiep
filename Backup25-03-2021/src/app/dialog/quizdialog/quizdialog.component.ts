import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import {FormControl, Validators} from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { LessonService } from '../../services/lesson.service';
import {Lesson} from '../../model/lesson';
import {Topic} from '../../model/topic';
import { TopicService } from '../../services/topic.service';
import { QuizDialogData } from '../shared/sharedata';
@Component({
  selector: 'app-quizdialog',
  templateUrl: './quizdialog.component.html',
  styleUrls: ['./quizdialog.component.css']
})
export class QuizdialogComponent implements OnInit {
  // public quizhastags = ['C', 'C#', 'C++', 'Java','Html/css','Python','IOS/Android','AI','Javascript','Machine Learning','UX/UI','Framework','Orther'];
  // public lessondataset: Lesson[] = [];
  // public hastag = "";
  public Topic: Topic[];
  public haveTopic = false;
  constructor(public dialogRef: MatDialogRef<QuizdialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: QuizDialogData,private topicServices:TopicService) {} 

  async ngOnInit(){
    this.data.time = 30;
    this.data.tagtopic ="";
    this.data.isCorrect = 1;
    await this.gettopic();
  }
  async gettopic(){
    this.Topic = await this.topicServices.gettopicsbycourseid(1) as Topic[];
    if(this.Topic.length > 0){
      this.haveTopic = !this.haveTopic;
    }
  }
  handleFileInput(files: FileList,imageOption:number) {
    console.log(files.item(0));
    console.log(imageOption);
    if (files.item(0)){
      switch (imageOption){
        case 1:
          this.data.imageOption1 = files.item(0);
          break;
        case 2:
          this.data.imageOption2 = files.item(0);
          break;
        case 3:
          this.data.imageOption3 = files.item(0);
          break;
        case 4:
          this.data.imageOption4 = files.item(0);
          break;
      }
    }  
    console.log(this.data.imageOption1+" "+this.data.imageOption2+" "+this.data.imageOption3+" "+this.data.imageOption4+" "+this.data.imageOption5);
  }
}
