import {Component, Inject,OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { VideoQuiz } from '../../coursedetail/coursedetail.component';
import { interval, Subscription} from 'rxjs';
@Component({
  selector: 'app-quizvideodialog',
  templateUrl: './quizvideodialog.component.html',
  styleUrls: ['./quizvideodialog.component.css']
})
export class QuizvideodialogComponent implements OnInit {
  answer = "";
  userAnswer:boolean = false;
  mySubscription: Subscription;
  constructor(public dialogRef: MatDialogRef<QuizvideodialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VideoQuiz) {
      console.log(this.data);
    }

  ngOnInit(): void {
  }
  getAnswer(answer){
    this.userAnswer = !this.userAnswer;
    this.answer = answer;
    this.mySubscription= interval(3000).subscribe((x =>{
      this.mySubscription.unsubscribe();
      this.dialogRef.close();
    }));
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
