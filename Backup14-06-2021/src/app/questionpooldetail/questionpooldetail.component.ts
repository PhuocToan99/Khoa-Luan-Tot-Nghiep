import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Params } from '@angular/router';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { Quiz } from '../model/quiz';
import { QuizService} from '../services/quiz.service';
import { Choice } from '../model/choice';
import { ChoiceService} from '../services/choice.service';
import { QuizdialogComponent } from '../dialog/quizdialog/quizdialog.component';
import { QuizDialogData } from '../dialog/shared/sharedata';
import {ExcelService} from '../services/excel.service';
import * as XLSX from 'xlsx';
import { NotificationService } from '../services/notification.service';
import { ExamquizserviceService } from '../services/examquizservice.service';
import { Questionpool } from '../model/questionpool';
import { QuestionpoolService } from '../services/questionpool.service';
import { QuestionpooldialogComponent } from '../dialog/questionpooldialog/questionpooldialog.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-questionpooldetail',
  templateUrl: './questionpooldetail.component.html',
  styleUrls: ['./questionpooldetail.component.css']
})
export class QuestionpooldetailComponent implements OnInit {
  id:any;
  quizlist: Quiz[] = [];
  public Question ="";
  public Option1 ="";
  public Option2 ="";
  public Option3 ="";
  public Option4 ="";
  public Option5 ="";
  public isCorrect;
  public ImageOption1 = null;
  public ImageOption2 = null;
  public ImageOption3 = null;
  public ImageOption4 = null;
  public ImageOption5 = null;
  public ImageQuestion = null;
  public ImageURLOption1 ="";
  public ImageURLOption2 ="";
  public ImageURLOption3 ="";
  public ImageURLOption4 ="";
  public ImageURLOption5 ="";
  public ImageURLQuestion ="";
  public Description ="";
  public QuestionType="";
  public Time;
  public Tagtopic;
  isSave:boolean = false;
  data: [][];
  questionpool:Questionpool;
  constructor(private excelService:ExcelService,private route: ActivatedRoute,private quizService: QuizService, private router: Router,private choiceService:ChoiceService,
    public dialog: MatDialog,private notificationService: NotificationService,private changeDetection: ChangeDetectorRef,
    private questionpoolService:QuestionpoolService, private datePipe: DatePipe) {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
      }
    );
   }

  async ngOnInit(){
    await this.getQuizList(this.id);
  }
  async getQuizList(id){
    this.quizlist = [];
    this.questionpool = new Questionpool();
    this.questionpool = await this.questionpoolService.getQuestionpool(this.id) as Questionpool;
    var result = await this.quizService.getQuizOfQuestionpool(id) as Quiz[];
    console.log(result);
    result.forEach((item) => {
      if (this.quizlist.findIndex(i => i.quizId == item.quizId && item.quizId != null) === -1) 
      {
          this.quizlist.push(item)
      }
  
  });
   return this.quizlist;
  }
  back(){
    this.router.navigate(['managequestionpool']);
  }
  openQuizDialog(){
    const dialogRef = this.dialog.open(QuizdialogComponent, {
      width: '60%',
      height: '70vh',
      data: { question : this.Question,option1 : this.Option1,option2 :this.Option2,option3 : this.Option3,option4 : this.Option4,option5 : this.Option5,isCorrect: this.isCorrect,imageOption1 :this.ImageOption1,
        imageOption2 :this.ImageOption2,imageOption3 : this.ImageOption3,imageOption4 : this.ImageOption4,imageOption5 : this.ImageOption5,imageURLOption1 :this.ImageURLOption1,
        imageURLOption2 :this.ImageURLOption2,imageURLOption3 :this.ImageURLOption3,imageURLOption4 :this.ImageURLOption4,imageURLOption5 :this.ImageURLOption5,
        description : this.Description,time: this.Time,
        tagtopic: this.Tagtopic,imageQuestion : this.ImageQuestion,imageURLQuestion : this.ImageURLQuestion,questionType: this.QuestionType}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != null){
        this.addQuiz(result);
      }
      this.getQuizList(this.id);
      console.log(this.quizlist);
    });
  }
  public addQuiz = async (quizdata: QuizDialogData) =>{
    var quiz : Quiz = new Quiz;
    if(quizdata.question != ""){
    quiz.question = quizdata.question;
    }
    if(quizdata.question == ""){
    if(quizdata.imageQuestion != undefined){
    this.ImageQuestion = quizdata.imageQuestion;
    quiz.image = this.ImageQuestion;
    }
    }
    quiz.description = quizdata.description;
    quiz.questionType = quizdata.questionType;
    quiz.questionpoolId = this.id;
    quiz.time = quizdata.time;
    quiz.topicId = quizdata.tagtopic;
    await this.quizService.postQuiz(quiz);
    if(quizdata.option1 != undefined || quizdata.imageURLOption1 != "" || quizdata.imageOption1 != undefined){
      if(quizdata.isCorrect == 1){
        await this.addAnswerInput(quizdata.option1,true,quizdata.imageOption1,quizdata.imageURLOption1);
      }
      else{
        await this.addAnswerInput(quizdata.option1,false,quizdata.imageOption1,quizdata.imageURLOption1);
      }
    }
    if(quizdata.option2 != undefined || quizdata.imageURLOption2 != "" || quizdata.imageOption2 != undefined){
      if(quizdata.isCorrect == 2){
        await this.addAnswerInput(quizdata.option2,true,quizdata.imageOption2,quizdata.imageURLOption2);
      }
      else{
        await this.addAnswerInput(quizdata.option2,false,quizdata.imageOption2,quizdata.imageURLOption2);
      }
    }
    if(quizdata.option3 != undefined || quizdata.imageURLOption3 != "" || quizdata.imageOption3 != undefined){
      if(quizdata.isCorrect == 3){
        await this.addAnswerInput(quizdata.option3,true,quizdata.imageOption3,quizdata.imageURLOption3);
      }
      else{
        await this.addAnswerInput(quizdata.option3,false,quizdata.imageOption3,quizdata.imageURLOption3);
      }
    }
    if(quizdata.option4 != undefined || quizdata.imageURLOption4 != "" || quizdata.imageOption4 != undefined){
      if(quizdata.isCorrect == 4){
        await this.addAnswerInput(quizdata.option4,true,quizdata.imageOption4,quizdata.imageURLOption4);
      }
      else{
        await this.addAnswerInput(quizdata.option4,false,quizdata.imageOption4,quizdata.imageURLOption4);
      }
    }
    if(quizdata.option5 != undefined || quizdata.imageURLOption5 != "" || quizdata.imageOption5 != undefined){
      if(quizdata.isCorrect == 5){
        await this.addAnswerInput(quizdata.option5,true,quizdata.imageOption5,quizdata.imageURLOption5);
      }
      else{
        await this.addAnswerInput(quizdata.option5,false,quizdata.imageOption5,quizdata.imageURLOption5);
      }
    }
    window.location.reload();
    console.log(this.quizlist);
  }
  public addAnswerInput = async (answer:string,flag:boolean,image,imageURL) =>{
    var choice:Choice = new Choice;
    choice.answer = answer;
    choice.isCorrect = flag;
    if(imageURL != ""){
      choice.imageLink = imageURL;
    }
    else{
      choice.imageLink = "";
    }
    if(image != undefined){
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
      console.log(this.data);
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
        quizdata.questionpoolId = this.id;
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
        await this.getQuizList(this.id);
        console.log(this.getQuizList(this.id));
        this.changeDetection.detectChanges();
      }
    };
    console.log(this.quizlist);

    reader.readAsBinaryString(target.files[0]);

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
  async deleteQuiz(id){
    var r = confirm("Delete this quiz?");
    if(r == true){
      console.log(id);
      await this.quizService.deleteQuiz(id);
      this.notificationService.showDeleteNotification("Delete quiz success","Delete success",3000);
      await this.getQuizList(this.id); 
      this.changeDetection.detectChanges();
      console.log(this.quizlist);
    }
  }
  async editQuiz(quiz:Quiz){
    let choice3 = quiz.choices[2] == undefined ? null : (quiz.choices[2].answer == undefined ? null : quiz.choices[2].answer) ;
    let choice4 = quiz.choices[3] == undefined ? null : (quiz.choices[3].answer == undefined ? null : quiz.choices[3].answer) ;
    let choice5 = quiz.choices[4] == undefined ? null : (quiz.choices[4].answer == undefined ? null : quiz.choices[4].answer) ;
    let imageQuestion = quiz == undefined ? null : (quiz.image == undefined ? null : quiz.image);
    let imageURLQuestion = quiz.imageLink == undefined ? null : (quiz.imageLink == undefined ? null : quiz.imageLink);
    let imageOption1 = quiz.choices[0] == undefined ? null : (quiz.choices[0].image == undefined ? null : quiz.choices[0].image);
    let imageURLOption1 = quiz.choices[0] == undefined ? null : (quiz.choices[0].imageLink == undefined ? null : quiz.choices[0].imageLink);
    let imageOption2 = quiz.choices[1] == undefined ? null : (quiz.choices[1].image == undefined ? null : quiz.choices[1].image);
    let imageURLOption2 = quiz.choices[1] == undefined ? null : (quiz.choices[1].imageLink == undefined ? null : quiz.choices[1].imageLink);
    let imageOption3 = quiz.choices[2] == undefined ? null : (quiz.choices[2].image == undefined ? null : quiz.choices[2].image);;
    let imageURLOption3 = quiz.choices[2] == undefined ? null : (quiz.choices[2].imageLink == undefined ? null : quiz.choices[2].imageLink);
    let imageOption4 = quiz.choices[3] == undefined ? null : (quiz.choices[0].image == undefined ? null : quiz.choices[3].image);
    let imageURLOption4 = quiz.choices[3] == undefined ? null : (quiz.choices[3].imageLink == undefined ? null : quiz.choices[3].imageLink);
    let imageOption5 = quiz.choices[4] == undefined ? null : (quiz.choices[4].image == undefined ? null : quiz.choices[4].image);
    let imageURLOption5 = quiz.choices[4] == undefined ? null : (quiz.choices[4].imageLink == undefined ? null : quiz.choices[4].imageLink);
    const dialogRef = this.dialog.open(QuizdialogComponent, {
      width: '60%',
      height: '70vh',
      data: { question : quiz.question,option1 : quiz.choices[0].answer,option2 :quiz.choices[1].answer,option3 : choice3,option4 : choice4,option5 : choice5,isCorrect: this.isCorrect,imageOption1 : imageOption1,
        imageOption2 :imageOption2,imageOption3 : imageOption3,imageOption4 : imageOption4,imageOption5 : imageOption5,imageURLOption1 :imageURLOption1,
        imageURLOption2 :imageURLOption2,imageURLOption3 :imageURLOption3,imageURLOption4 :imageURLOption4,imageURLOption5 :imageURLOption5,
        description : quiz.description,time: quiz.time,
        tagtopic: quiz.topicId,imageQuestion : imageQuestion,imageURLQuestion : imageURLQuestion,questionType: quiz.questionType}
    });
    dialogRef.afterClosed().subscribe( async result =>{
      console.log(result);
      if(result != null && result != undefined){
        var quizResult = new Quiz();
        quizResult.question = result.question;
        quizResult.description = result.description;
        quizResult.image = result.imageQuestion;
        quizResult.imageLink = result.imageURLQuestion;
        quizResult.questionType = result.questionType;
        quizResult.questionpoolId = quiz.questionpoolId;
        quizResult.quizId = quiz.quizId;
        quizResult.time = result.time;
        quizResult.topicId = result.tagtopic;
        try{
          console.log(quiz.quizId);
          console.log(quizResult);
          await this.quizService.updateQuiz(quiz.quizId,quizResult);
          await this.editChoice(quiz.choices[0].choiceId,result.option1,result.imageOption1,result.imageOption1,quiz.quizId,result.isCorrect,"1");
          await this.editChoice(quiz.choices[1].choiceId,result.option2,result.imageOption2,result.imageOption2,quiz.quizId,result.isCorrect,"2");
          if(result.option3 != "" || result.imageOption3 != undefined || result.imageURLOption3 != ""){
            if(quiz.choices[2] == undefined){
              await this.addNewAnwser(result.option3,result.imageOption3,result.imageOption3,quiz.quizId,result.isCorrect,"3");
            }
            else{
              await this.editChoice(quiz.choices[2].choiceId,result.option3,result.imageOption3,result.imageOption3,quiz.quizId,result.isCorrect,"3");
            }
          }
          if(result.option3 == "" && result.imageOption3 == undefined && result.imageURLOption3 == ""){
            if(quiz.choices[2] != undefined){
              await this.choiceService.deletechoice(quiz.choices[2].choiceId);
            }
          }
          if(result.option4 != "" || result.imageOption4 != undefined || result.imageURLOption4 != ""){
            if(quiz.choices[3] == undefined){
              await this.addNewAnwser(result.option4,result.imageOption4,result.imageOption4,quiz.quizId,result.isCorrect,"4");
            }
            else{
              await this.editChoice(quiz.choices[3].choiceId,result.option4,result.imageOption4,result.imageOption4,quiz.quizId,result.isCorrect,"4");
            }
          }
          if(result.option4 == "" && result.imageOption4 == undefined && result.imageURLOption4 == ""){
            if(quiz.choices[3] != undefined){
              await this.choiceService.deletechoice(quiz.choices[3].choiceId);
            }
          }
          if(result.option5 != "" || result.imageOption5 != undefined || result.imageURLOption5 != ""){
            if(quiz.choices[4] == undefined){
              await this.addNewAnwser(result.option5,result.imageOption5,result.imageOption5,quiz.quizId,result.isCorrect,"5");
            }
            else{
              await this.editChoice(quiz.choices[4].choiceId,result.option5,result.imageOption5,result.imageOption5,quiz.quizId,result.isCorrect,"5");
            }
          }
          if(result.option5 == "" && result.imageOption5 == undefined && result.imageURLOption5 == ""){
            if(quiz.choices[4] != undefined){
              await this.choiceService.deletechoice(quiz.choices[4].choiceId);
            }
          }
        await this.getQuizList(this.id);
        this.changeDetection.detectChanges();
        this.notificationService.showNotification("Update quiz success","Update success",1500);
        }
        catch(e){
          console.log(e);
          this.notificationService.showDeleteNotification("Update quiz fail","Update fail",1500);
        }
      }
    });
  }
  
  public editChoice = async (choiceId,answer,image,imageLink,quizId,isCorrect,index) =>{
    var choice: Choice = new Choice();
      choice.choiceId = choiceId;
      choice.answer = answer;
      choice.image = image;
      choice.imageLink = imageLink;
      choice.quizId = quizId;
      choice.isCorrect = (isCorrect == index) ? true : false;
      await this.choiceService.updatechoice(choiceId,choice);
  }
  public addNewAnwser = async (answer,image,imageLink,quizId,isCorrect,index) =>{
    var choice: Choice = new Choice();
      choice.answer = answer;
      choice.image = image;
      choice.imageLink = imageLink;
      choice.quizId = quizId;
      choice.isCorrect = (isCorrect == index) ? true : false;
      console.log(choice);
      await this.choiceService.postchoice(choice);
  }
  openQuestionpoolDialog(): void {
    const dialogRef = this.dialog.open(QuestionpooldialogComponent, {
      width: '500px',
      height: '600px',
      data: {questionpoolName: this.questionpool.questionpoolName,createdDate: this.questionpool.createdDate,
      lastEdited: this.questionpool.lastEdited,hastag:this.questionpool.hastag,
      thumbnailImage: this.questionpool.questionpoolThumbnailImage,courseId:this.questionpool.courseId,accountId:this.questionpool.accountId }
    });
    dialogRef.afterClosed().subscribe(async result => {
      result.lastEdited = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      result.isActive = this.questionpool.isActive;
      result.questionpoolId = this.questionpool.questionpoolId;
      try {
        await this.questionpoolService.updateQuestionpool(this.id,result);
        this.questionpool = new Questionpool;
        this.questionpool = await this.questionpoolService.getQuestionpool(this.id) as Questionpool;
        console.log(this.questionpool);
        this.changeDetection.detectChanges();
        this.notificationService.showNotification("Update questionpool "+result.questionpoolName+" success","Update success",3000);
      }
      catch (e) {
        this.notificationService.showDeleteNotification("Update your questionpool fail. Please try again","Update fail",3000);
      }
    });
  }
  async deactiveQuestionpool(state){
    await this.questionpoolService.deactiveQuestionpool(this.questionpool);
    if(state){
      this.notificationService.showDeleteNotification("Deactive questionpool "+this.questionpool.questionpoolName+" success","Deactive success",3000);
    }
    else{
      this.notificationService.showNotification("Active questionpool "+this.questionpool.questionpoolName+" success","Active success",3000);
    }
  }
}
