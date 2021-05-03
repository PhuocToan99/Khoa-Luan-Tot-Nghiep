import { Component, OnInit, Inject } from '@angular/core';
import {Topic} from '../../model/topic';
import { TopicService } from '../../services/topic.service';
import { QuizDialogData } from '../shared/sharedata';
import { ImageloadService } from '../../services/imageload.service';
import { UploadimagedialogComponent } from '../uploadimagedialog/uploadimagedialog.component';
import { ImageUploadDialogData } from '../shared/sharedata';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from 'lodash';
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
  public imageURL ="";
  public imageOption;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64ImageQuestion: any;
  cardImageBase64Image1: any;
  cardImageBase64Image2: any;
  cardImageBase64Image3: any;
  cardImageBase64Image4: any;
  errorImage:boolean = false;
  constructor(public dialogRef: MatDialogRef<QuizdialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: QuizDialogData,private topicServices:TopicService,private imageLoadService:ImageloadService,public dialog: MatDialog) {
    // console.log(this.data.imageOption1 + " " + this.data.imageOption2 + " " + this.data.imageOption3 + " " + this.data.imageOption4 + " " + this.data.imageOption5 + " " +
    //   this.data.imageURLQuestion + " " + this.data.imageURLOption1 + " " + this.data.imageURLOption2 + " " + this.data.imageURLOption3 + " " + this.data.imageURLOption4 + " " +
    //   this.data.imageURLOption5);
  } 

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
        case 0:
          this.data.imageQuestion = files.item(0);
          break;
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
  cancel(): void {
    this.data.description = "";
    this.data.question ="";
    this.data.option1 = "";
    this.data.option2 ="";
    this.data.option3 ="";
    this.data.option4 = "" ;
    this.data.option5 = "" ;
    this.data.isCorrect = 0;
    this.data.imageQuestion = null;
    this.data.questionType = "";
    this.data.imageOption1 = null;
    this.data.imageOption2 = null;
    this.data.imageOption3 = null;
    this.data.imageOption4 = null;
    this.data.imageOption5 = null;
    this.data.imageURLQuestion = "";
    this.data.imageURLOption1 = "";
    this.data.imageURLOption2 = "";
    this.data.imageURLOption3 = "";
    this.data.imageURLOption4 = "";
    this.data.imageURLOption5 = "";
    this.data.time = 0;
    this.data.tagtopic ="";
    this.data = null;
    this.dialogRef.close();
  }
  openImageUploadDialog(option : number){
    this.imageURL ="";
    this.imageOption = undefined;
    switch (option){
    case 0:
      this.imageURL = this.data.imageURLQuestion;
      this.imageOption =this.cardImageBase64ImageQuestion;
      break;
    case 1:
      this.imageURL = this.data.imageURLOption1;
      this.imageOption =this.data.imageOption1;
      break;
    case 2:
      this.imageURL = this.data.imageURLOption2;
      this.imageOption =this.data.imageOption2;
      break;
    case 3:
      this.imageURL = this.data.imageURLOption3;
      this.imageOption =this.data.imageOption3;
      break;
    case 4:
      this.imageURL = this.data.imageURLOption4;
      this.imageOption =this.data.imageOption4;
      break;
    }
    const dialogRef = this.dialog.open(UploadimagedialogComponent, {
      width: '30%',
      height: '40vh',
      data: {  imageURL : this.imageURL ,imageOption : this.imageOption }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      // switch (option){
      // case 0:
      // if(result.imageURL != ""){
      //   this.data.imageURLQuestion = result.imageURL;
      //   break;
      // }
      // if(result.imageOption != null || result.imageOption != undefined){
      //   this.data.imageQuestion = result.imageOption;
      //   break;
      // }
      // case 1:
      //   if(result.imageURL != ""){
      //     this.data.imageURLOption1 = result.imageURL;
      //     break;
      //   }
      //   if(result.imageOption != null || result.imageOption != undefined){
      //     this.data.imageOption1 = result.imageOption;
      //     break;
      //   }
      // case 2:
      //     if(result.imageURL != ""){
      //       this.data.imageURLOption2 = result.imageURL;
      //       break;
      //     }
      //     if(result.imageOption != null || result.imageOption != undefined){
      //       this.data.imageOption2 = result.imageOption;
      //       break;
      //     }
      // case 3:
      //       if(result.imageURL != ""){
      //         this.data.imageURLOption3 = result.imageURL;
      //         break;
      //       }
      //       if(result.imageOption != null || result.imageOption != undefined){
      //         this.data.imageOption3 = result.imageOption;
      //         break;
      //       }
      // case 4:
      //         if(result.imageURL != ""){
      //           this.data.imageURLOption4 = result.imageURL;
      //           break;
      //         }
      //         if(result.imageOption != null || result.imageOption != undefined){
      //           this.data.imageOption4 = result.imageOption;
      //           break;
      //         }
      // }
      switch (option){
        case 0:
          this.data.imageURLQuestion = result.imageURL;
          this.data.imageQuestion = result.imageOption;
          break;
        case 1:
          this.data.imageURLOption1 = result.imageURL;
          this.data.imageOption1 = result.imageOption;
          break;
        case 2:
          this.data.imageURLOption2 = result.imageURL;
          this.data.imageOption2 = result.imageOption;
          break;
        case 3:
          this.data.imageURLOption3 = result.imageURL;
          this.data.imageOption3 = result.imageOption;
          break;
        case 4:
          this.data.imageURLOption4 = result.imageURL;
          this.data.imageOption4 = result.imageOption;
          break;
        }
    });
  }
  check() : boolean{
    if( this.data.imageOption1 != undefined || this.data.imageOption2 != undefined || this.data.imageOption3 != undefined || this.data.imageOption4 != undefined || this.data.imageOption5 != undefined
      || this.data.imageURLOption1 != "" || this.data.imageURLOption2 != "" || this.data.imageURLOption3 != "" || this.data.imageURLOption4 != "" || this.data.imageURLOption5 != ""){
        return true;
      }
    return false;
  }
  checkQuestionImage() : boolean{
    if( this.data.imageQuestion != undefined || this.data.imageURLQuestion != ""){
        return true;
    }
    return false;
  }
  public loadimage(url) {
    return this.imageLoadService.getImageSource(url);
  }
  async loadFileImage(file : any,option : number){
    switch(option){
    case 0:
      return this.cardImageBase64ImageQuestion = await this.toBase64(file);
    case 1:
      return this.cardImageBase64Image1 = await this.toBase64(file);
    case 2:
      return this.cardImageBase64Image2 = await this.toBase64(file);
    case 3:
      return this.cardImageBase64Image3 = await this.toBase64(file);
    case 4:
      return this.cardImageBase64Image4 = await this.toBase64(file);
    }
  }
   toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
