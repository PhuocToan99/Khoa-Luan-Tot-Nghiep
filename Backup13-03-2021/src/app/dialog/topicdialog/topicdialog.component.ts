import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TopicDialogData } from '../shared/sharedata';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-topicdialog',
  templateUrl: './topicdialog.component.html',
  styleUrls: ['./topicdialog.component.css']
})
export class TopicdialogComponent implements OnInit {
  mess: string;
  constructor(public dialogRef: MatDialogRef<TopicdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TopicDialogData, private httpClient: HttpClient) { 
      console.log(data);
      console.log(data.topicTitle);
      if(data.topicTitle == ""){
        this.mess = "Add Topic Detail";
      }
      else{
        this.mess = "Edit Topic Infomation";
      }
    }

  ngOnInit(): void {
  }

}
