import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { SelectQuizComponent } from '../select-quiz/select-quiz.component';
import { QuizInfoDialogDataAPI, VideoQuizTime } from '../shared/dialogData';
import { LessonService } from '../../services/lesson.service';
@Component({
  selector: 'app-quizvideodialoginfo',
  templateUrl: './quizvideodialoginfo.component.html',
  styleUrls: ['./quizvideodialoginfo.component.css']
})
export class QuizvideodialoginfoComponent implements OnInit {
  listVideoQuizDialogTime:VideoQuizTime[] = [];
  quizId = "";
  timeId = "";
  haveData:boolean[] = [];
  validTime:boolean[] = [];
  validQuizId:boolean[] = [];
  listQuizId:string[] =[];
  listTime:string[] =[];
  constructor(public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: VideoQuizTime, private dialogRef: MatDialogRef<QuizvideodialoginfoComponent>,
  private lessonService:LessonService) { 
    console.log(this.data);
    this.loadVideoQuiz();
  }

  ngOnInit(): void {
  }
  openSelectQuiz(id){
    const dialogRef = this.dialog.open(SelectQuizComponent,{
      data:{quizId:this.quizId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result.quizId);
      if(result.quizId =="Noquiz"){
        this.dialogRef.close();
        return;
      }
      if(result.quizId != "" && result.quizId != null && result.quizId != undefined){
        this.listQuizId[id] = result.quizId;
      }
    });
  }
  addQuiz() {
    let videoQuizTime = new VideoQuizTime();
    videoQuizTime.id = this.listVideoQuizDialogTime.length + 1;
    videoQuizTime.time = "";
    videoQuizTime.quizId = "";
    this.listVideoQuizDialogTime.push(videoQuizTime);
    console.log(this.listVideoQuizDialogTime);
    this.listQuizId.push("");
    this.listTime.push("");
    this.validQuizId.push(true);
    this.validTime.push(true);
  }

  removeQuiz(i: number) {
    this.listVideoQuizDialogTime.splice(i, 1);
    console.log(this.listVideoQuizDialogTime);
    this.returnData();
  }

  logValue() {
    console.log(this.listVideoQuizDialogTime);
  }
  saveInfo(id){
    console.log(id+" "+this.listQuizId[id] + " "+this.listTime[id]);
    if(parseInt(this.listTime[id]) > this.data.videoDuration){
      alert("Quiz time cannot greater than video duration");
      return;
    }
    for(let k = 0;k<this.listTime.length;k++){
      if(k == id) continue;
      else{
        var result = this.listTime.filter(e => e == this.listTime[k]);
        if(result.length > 1){
          alert("Already have quiz on this time.Please try again");
          return;
        }
      }
    }
    this.validQuizId[id] = (this.listQuizId[id] == "" || this.listQuizId[id] == null || this.listQuizId[id] == undefined) ? false : true;
    this.validTime[id] = (this.listTime[id] == "" || this.listTime[id] == null || this.listTime[id] == undefined) ? false : true;
    if(this.validQuizId[id] && this.validTime[id]){
      this.listVideoQuizDialogTime[id - 1].quizId = this.listQuizId[id];
      this.listVideoQuizDialogTime[id - 1].time = this.listTime[id];
      this.returnData();
    }
    return;
  }
  returnData(){
    this.data.quizId = "";
    this.data.time = "";
      for(let i = 0;i < this.listVideoQuizDialogTime.length;i++){
        this.data.quizId = this.data.quizId.concat(" "+this.listVideoQuizDialogTime[i].quizId);
        this.data.time = this.data.time.concat(" "+this.listVideoQuizDialogTime[i].time);
        console.log("QuizID:"+this.data.quizId+" Time"+this.data.time);
      }
  }
  async loadVideoQuiz(){
    var result = await this.lessonService.getVideoQuizInfo(this.data.lessonId) as QuizInfoDialogDataAPI[];
    if(result){
      result.forEach(e => {
        let videoQuizTime = new VideoQuizTime();
        videoQuizTime.id = this.listVideoQuizDialogTime.length + 1;
        videoQuizTime.time = e.time.toString();
        videoQuizTime.quizId = e.quizID;
        this.listVideoQuizDialogTime.push(videoQuizTime);
        this.listQuizId.push(e.quizID.toString());
        this.listTime.push(e.time.toString());
        this.validQuizId.push(true);
        this.validTime.push(true);
        this.haveData.push(true);
      });
      console.log(this.listQuizId);
      console.log(this.listTime);
      this.returnData();
    }
    else{
      this.addQuiz();
    }
  }
  onSearchChange(value,id){
    this.listTime[id] = value;
    console.log(this.listTime);
  }
}
