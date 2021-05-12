import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { LessonService } from '../../services/lesson.service';
import {Lesson} from '../../model/lesson';
import { DatePipe } from '@angular/common';
import { QuestionpoolDialogData } from '../shared/sharedata';
@Component({
  selector: 'app-questionpooldialog',
  templateUrl: './questionpooldialog.component.html',
  styleUrls: ['./questionpooldialog.component.css']
})
export class QuestionpooldialogComponent implements OnInit {
  public questionpoolhastags = ['C', 'C#', 'C++', 'Java','Html/css','Python','IOS/Android','AI','Javascript','Machine Learning','UX/UI','Framework','Orther'];
  public lessondataset: Lesson[] = [];
  public hastag = "";
  constructor(public dialogRef: MatDialogRef<QuestionpooldialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuestionpoolDialogData, private httpClient: HttpClient,
    private lessonservice: LessonService,private datePipe: DatePipe) { 
      this.data.createdDate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      this.data.lastEdited = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    }

  async ngOnInit() {
    var list = await this.lessonservice.getalllessonbycourseids(this.data.courseId) as Lesson[];
    this.lessondataset = list;
    console.log(this.data.courseId +" "+ this.lessondataset);
  }
  pushhastag(hastag){
    console.log(hastag);
    this.data.hastag = hastag;
    console.log(this.data.hastag);
  }

}
