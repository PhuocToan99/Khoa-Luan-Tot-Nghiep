import { Component, OnInit } from '@angular/core';
import { cssNumber } from 'jquery';
import * as XLSX from 'xlsx';
import { Questionpool } from '../model/questionpool';
import { Quiz } from '../model/quiz';
import { QuizService} from '../services/quiz.service';
import { Choice } from '../model/choice';
import { ChoiceService} from '../services/choice.service';
import {ExcelService} from '../services/excel.service';
import { QuestionpoolService} from '../services/questionpool.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { QuizdialogComponent } from '../dialog/quizdialog/quizdialog.component';
import { QuizDialogData } from '../dialog/shared/sharedata';
@Component({
  selector: 'app-excelreader',
  templateUrl: './excelreader.component.html',
  styleUrls: ['./excelreader.component.css']
})
export class ExcelreaderComponent implements OnInit {
  public quizlist : Quiz[] = [];
  public Question ="";
  public Option1 ="";
  public Option2 ="";
  public Option3 ="";
  public Option4 ="";
  public Option5 ="";
  public isCorrect;
  public ImageOption1 ="";
  public ImageOption2 ="";
  public ImageOption3 ="";
  public ImageOption4 ="";
  public ImageOption5 ="";
  public ImageQuestion ="";
  public Description ="";
  public QuestionType="";
  public Time;
  public Tagtopic;
  data: [][];
  data1: [][];
  data2: any = [
    {
       
        "CATEGORYID": 1,
        "CATEGORYNAME": "BOOKS",
        "DESCRIPTION": "It contains all types of books",
        "IMAGE": "Books",
        "STATUS": "TRUE"
    },
    {
       
        "CATEGORYID": 2,
        "CATEGORYNAME": "EBOOKS",
        "DESCRIPTION": "It contains all types of ebooks",
        "IMAGE": "Ebooks",
        "STATUS": "TRUE"
    },
    {
     
        "CATEGORYID": 3,
        "CATEGORYNAME": "Bookss",
        "DESCRIPTION": "DESCRIPTION",
        "IMAGE": "IMAGE",
        "STATUS": "TRUE"
    }
  ]
  constructor(private excelService:ExcelService,private questionpoolService:QuestionpoolService,private quizService:QuizService,private choiceService:ChoiceService,public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  onFileChangeQuiz (evt: any){
    const target : DataTransfer =  <DataTransfer>(evt.target);
    
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname : string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      console.log(ws);

      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      //Chay duoc 
      /*console.log(this.data);
      let x = this.data.slice(1);
      console.log(x);
      for(var k = 1;k < this.data.length;k++){
        console.log(this.data[k]);
        var quiz1 = this.data[k] as any;
        console.log(quiz1);
        var quiz:Quiz = new Quiz;
        var temp = quiz1[0] as string;
        var temp1 = quiz1[1] as number;
        var temp2 = quiz1[2] as number;
        console.log(temp +" "+temp1+" "+temp2);
        quiz.question = temp;
        quiz.point = temp1;
        quiz.time = temp2;
        this.quizlist.push(quiz);
      }*/

      //Chay duoc 
      console.log(this.data);
      // let x = this.data.slice(1);
      // console.log(x);
      for(var k = 1;k < this.data.length;k++){
        var quiz1 = this.data[k] as any;
        console.log(quiz1);
        var quizdata:Quiz = new Quiz;
        var quiz = quiz1[0] as string;
        var questionType = quiz1[1] as string;
        var answer1 = quiz1[2] as string;
        var answer2 = quiz1[3] as string;
        var answer3 = quiz1[4] as string;
        var answer4 = quiz1[5] as string;
        var answer5 = quiz1[6] as string;
        var isCorrect = quiz1[7] as number;
        var point = quiz1[8] as number;
        var time = quiz1[9] as number;
        var image = quiz1[10] as string;
        quizdata.topicId = "";
        quizdata.questionpoolId = "3";
        quizdata.time = time;
        quizdata.question = quiz;
        quizdata.questionType = questionType;
        console.log(quiz +" "+questionType+" "+answer1+" "+answer2+" "+answer3+" "+answer4+" "+answer5+" "+isCorrect+" "+point+" "+time+" "+image);
        console.log(quizdata);
        await this.quizService.postQuiz(quizdata);
        if(answer1 != undefined){
          if(isCorrect == 1){
            await this.addAnswer(answer1,true);
          }
          else{
            await this.addAnswer(answer1,false);
          }
        }
        if(answer2 != undefined){
          if(isCorrect == 2){
            await this.addAnswer(answer2,true);
          }
          else{
            await this.addAnswer(answer2,false);
          }
        } 
        if(answer3 != undefined){
          if(isCorrect == 3){
            await this.addAnswer(answer3,true);
          }
          else{
            await this.addAnswer(answer3,false);
          }
        }
        if(answer4 != undefined){
          if(isCorrect == 4){
            await this.addAnswer(answer4,true);
          }
          else{
            await this.addAnswer(answer4,false);
          }
        }
        if(answer5 != undefined){
          if(isCorrect == 5){
            await this.addAnswer(answer5,true);
          }
          else{
            await this.addAnswer(answer5,false);
          }
        }
        this.quizlist.push(quizdata);
      }
    };
    console.log(this.quizlist);

    reader.readAsBinaryString(target.files[0]);

  }
  onFileChangeAnswer(evt: any) {
    const target : DataTransfer =  <DataTransfer>(evt.target);
    
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname : string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      console.log(ws);

      this.data1 = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      console.log(this.data);
      let x = this.data.slice(1);
      console.log(x);
      for (var i in x){
        console.log(i);
        for (var key in x[i]){
            console.log( key + ": " + x[i][key]);
        }
    }

    };

    reader.readAsBinaryString(target.files[0]);

  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'myExcelFile');
  }
  public addAnswer = async (answer:string,flag:boolean) =>{
    var choice:Choice = new Choice;
    choice.answer = answer;
    choice.isCorrect = flag;
    var lastQuiz = await this.quizService.getLastQuizs() as Quiz;
    var id = lastQuiz.quizId;
    console.log(id);
    choice.quizId = id;
    this.choiceService.postchoice(choice);
  }
  public addAnswerInput = async (answer:string,flag:boolean,image: string) =>{
    var choice:Choice = new Choice;
    choice.answer = answer;
    choice.isCorrect = flag;
    if(image != ""){
      choice.image = image;
    }
    else{
      choice.image = null;
    }
    var lastQuiz = await this.quizService.getLastQuizs() as Quiz;
    var id = lastQuiz.quizId;
    console.log(id);
    choice.quizId = id;
    this.choiceService.postchoice(choice);
  }
  public addQuiz = async (quizdata: QuizDialogData) =>{
    var quiz : Quiz = new Quiz;
    quiz.question = quizdata.question;
    quiz.image = quizdata.imageQuestion;
    quiz.description = quizdata.description;
    quiz.questionType = quizdata.questionType;
    quiz.questionpoolId = "3";
    quiz.time = quizdata.time;
    quiz.topicId = quizdata.tagtopic;
    await this.quizService.postQuiz(quiz);
    if(quizdata.option1 != ""){
      if(quizdata.isCorrect == 1){
        await this.addAnswerInput(quizdata.option1,true,quizdata.imageOption1);
      }
      else{
        await this.addAnswerInput(quizdata.option1,false,quizdata.imageOption1);
      }
    }
    if(quizdata.option2 != ""){
      if(quizdata.isCorrect == 2){
        await this.addAnswerInput(quizdata.option2,true,quizdata.imageOption2);
      }
      else{
        await this.addAnswerInput(quizdata.option2,false,quizdata.imageOption2);
      }
    }
    if(quizdata.option3 != ""){
      if(quizdata.isCorrect == 3){
        await this.addAnswerInput(quizdata.option3,true,quizdata.imageOption3);
      }
      else{
        await this.addAnswerInput(quizdata.option3,false,quizdata.imageOption3);
      }
    }
    if(quizdata.option4 != ""){
      if(quizdata.isCorrect == 4){
        await this.addAnswerInput(quizdata.option4,true,quizdata.imageOption4);
      }
      else{
        await this.addAnswerInput(quizdata.option4,false,quizdata.imageOption4);
      }
    }
    if(quizdata.option5 != ""){
      if(quizdata.isCorrect == 5){
        await this.addAnswerInput(quizdata.option5,true,quizdata.imageOption5);
      }
      else{
        await this.addAnswerInput(quizdata.option5,false,quizdata.imageOption5);
      }
    }
  }
  openQuizDialog(){
    const dialogRef = this.dialog.open(QuizdialogComponent, {
      width: '400px',
      data: { question : this.Question,option1 : this.Option1,option2 :this.Option2,option3 : this.Option3,option4 : this.Option4,option5 : this.Option5,isCorrect: this.isCorrect,imageOption1 :this.ImageOption1,
        imageOption2 :this.ImageOption2,imageOption3 : this.ImageOption3,imageOption4 : this.ImageOption4,imageOption5 : this.ImageOption5,description : this.Description,time: this.Time,
        tagtopic: this.Tagtopic,imageQuestion : this.ImageQuestion,questionType: this.QuestionType}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.addQuiz(result);
    });
  }
}
