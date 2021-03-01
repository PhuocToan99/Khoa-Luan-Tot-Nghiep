import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { QuizDialogData } from '../shared/sharedata';
import {FormControl, Validators} from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { LessonService } from '../../services/lesson.service';
import {Lesson} from '../../model/lesson';
@Component({
  selector: 'app-quizdialog',
  templateUrl: './quizdialog.component.html',
  styleUrls: ['./quizdialog.component.css']
})
export class QuizdialogComponent implements OnInit {
  public quizhastags = ['C', 'C#', 'C++', 'Java','Html/css','Python','IOS/Android','AI','Javascript','Machine Learning','UX/UI','Framework','Orther'];
  public lessondataset: Lesson[] = [];
  public hastag = "";
  constructor(public dialogRef: MatDialogRef<QuizdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuizDialogData, private httpClient: HttpClient,private quizservice: QuizService,
    private lessonservice: LessonService) { 
      
    }

    async ngOnInit()  {
      var list = await this.lessonservice.getalllessonbycourseids(this.data.courseId) as Lesson[];
      this.lessondataset = list;
      console.log(this.lessondataset);
    }
    pushhastag(hastag){
      console.log(hastag);
      this.data.hastag = hastag;
      console.log(this.data.hastag);
    }

}
