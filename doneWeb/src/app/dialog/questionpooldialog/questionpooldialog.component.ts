import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { QuestionpoolDialogData } from '../shared/sharedata';
@Component({
  selector: 'app-questionpooldialog',
  templateUrl: './questionpooldialog.component.html',
  styleUrls: ['./questionpooldialog.component.css']
})
export class QuestionpooldialogComponent implements OnInit {
  public questionpoolhastags = ['C', 'C#', 'C++', 'Java','Html/css','Python','IOS/Android','AI','Javascript','Machine Learning','UX/UI','Framework','Orther'];
  // public lessondataset: Lesson[] = [];
  public hastag = "";
  constructor(public dialogRef: MatDialogRef<QuestionpooldialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuestionpoolDialogData,private datePipe: DatePipe) { 
      this.data.createdDate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      this.data.lastEdited = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    }

  async ngOnInit() {
  }
  selected;
  pushhastag(hastag,i){
    console.log(hastag);
    this.data.hastag = hastag;
    this.selected=i;
    console.log(this.data.hastag);
  }

}
