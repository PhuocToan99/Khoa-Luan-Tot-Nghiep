import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { Quiz } from '../model/quiz';
import { QuizService} from '../services/quiz.service';
import { ChoiceService} from '../services/choice.service';
import { NotificationService } from '../services/notification.service';
import { ExamQuiz } from '../model/examquiz';
import { ExamquizserviceService } from '../services/examquizservice.service';
import {ExamquizdialogComponent} from '../dialog/examquizdialog/examquizdialog.component';
import { Questionpool } from '../model/questionpool';
import { QuestionpoolService } from '../services/questionpool.service';
@Component({
  selector: 'app-createexam',
  templateUrl: './createexam.component.html',
  styleUrls: ['./createexam.component.css']
})
export class CreateexamComponent implements OnInit {
  isSave;
  CourseId;
  selectedQuestionpoolId;
  questionpoolList:Questionpool[] = [];
  quizlist: Quiz[] = [];
  isCheck : boolean[];
  quizCode;
  constructor(private route: ActivatedRoute,private quizService: QuizService, private router: Router,private choiceService:ChoiceService,
    public dialog: MatDialog,private notificationService: NotificationService,private examQuizService: ExamquizserviceService,private questionpoolService: QuestionpoolService) {
      let courseInfo = JSON.parse(localStorage.getItem("course"));
      this.CourseId = parseInt(courseInfo.courseId);
      this.quizCode = localStorage.getItem("quizCode");
     }

  async ngOnInit() {
    await this.loadpage();
    this.filter(this.selectedQuestionpoolId);
  }
  ngOnDestroy(){
    localStorage.removeItem("quizCode");
  }
  checkState:[] =[];
  async loadpage(){
    this.questionpoolList = await this.questionpoolService.getQuestionpoolByContainId(this.CourseId) as Questionpool[];
    console.log(this.questionpoolList);
    this.selectedQuestionpoolId = this.questionpoolList[0].questionpoolId;
    if(this.quizCode != undefined){
      this.examQuizService.quizExam = await this.examQuizService.getExamByExamCode(this.quizCode) as ExamQuiz[];
    }
  }
  async filter(id){
    this.quizlist = [];
    console.log(id);
    if(this.questionpoolList.length > 0 && (id == undefined || id == null)){
      var result = await this.quizService.getQuizOfQuestionpool(this.questionpoolList[0].questionpoolId) as Quiz[];
      console.log(result);
      result.forEach((item) => {
        if (this.quizlist.findIndex(i => i.quizId == item.quizId && item.quizId != null) === -1) 
        {
            this.quizlist.push(item)
        }
      }); 
      console.log(this.quizlist);
      return this.quizlist;
    }
    if(this.questionpoolList.length > 0 && (id != undefined || id != null)){
      var result = await this.quizService.getQuizOfQuestionpool(id) as Quiz[];
      console.log(result);
      result.forEach((item, index) => {
        if (this.quizlist.findIndex(i => i.quizId == item.quizId && item.quizId != null) === -1) 
        {
            this.quizlist.push(item)
        }
      }); 
      if(this.examQuizService.quizExam.length > 0){
        for(var i =0;i<this.examQuizService.quizExam.length;i++){
          // var result = this.quizlist.find(q => q.quizId.toString() == this.examQuizService.quizExam[i].quizId);
          this.quizlist.forEach(e => {if(e.quizId.toString() == this.examQuizService.quizExam[i].quizId)
          {
            e.isInExamQuiz = true;
          }})
        }
      }
      console.log(this.quizlist);
      return this.quizlist;
    }
  }
  back(){
    this.router.navigate(['managequestionpool']);
  }
  openExamQuizDialog(){
    const dialogRef = this.dialog.open(ExamquizdialogComponent, {
      width: '60%',
      height: '70vh',
      data: { examQuizList: this.examQuizService.quizExam, isSave: this.isSave}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != null && result == true){
        this.createExam();
        this.notificationService.showNotification("Create your Examquiz success","Create success",1500);
      }
    });
  }
  async createExam(){
    await this.examQuizService.postQuizExam();
  }
  showOptions(event:any,quiz:Quiz): void {
    console.log(event);
    if(event == true){
      var id;
      console.log(this.examQuizService.quizExam);
      if(this.examQuizService.quizExam.length == 0){
         id = this.makeid(6);
      }
      else{
        id = this.examQuizService.quizExam[0].examCode;
        console.log(id);
      }
      var examquiz = new ExamQuiz();
      examquiz.examCode = id;
      examquiz.examQuestion = quiz.question;
      var correct = (quiz.choices.findIndex( e => e.isCorrect == true))+1;
      examquiz.examIsCorrect = correct.toString();
      examquiz.examOption1 = quiz.choices[0].answer;
      examquiz.examOption2 = quiz.choices[1].answer;
      examquiz.examOption3 = quiz.choices[2] == undefined ? null : (quiz.choices[2].answer == undefined ? null : quiz.choices[2].answer) ;
      examquiz.examOption4 = quiz.choices[3] == undefined ? null : (quiz.choices[3].answer == undefined ? null : quiz.choices[3].answer) ;
      examquiz.examOption5 = quiz.choices[4] == undefined ? null : (quiz.choices[4].answer == undefined ? null : quiz.choices[4].answer) ;
      examquiz.examQuestionImage = quiz == undefined ? null : (quiz.image == undefined ? null : quiz.image);
      examquiz.examQuestionImageURL = quiz.imageLink == undefined ? null : (quiz.imageLink == undefined ? null : quiz.imageLink);
      examquiz.examOptionImage1 = quiz.choices[0] == undefined ? null : (quiz.choices[0].image == undefined ? null : quiz.choices[0].image);
      examquiz.examOptionImageURL1 = quiz.choices[0] == undefined ? null : (quiz.choices[0].imageLink == undefined ? null : quiz.choices[0].imageLink);
      examquiz.examOptionImage2 = quiz.choices[1] == undefined ? null : (quiz.choices[1].image == undefined ? null : quiz.choices[1].image);
      examquiz.examOptionImageURL2 = quiz.choices[1] == undefined ? null : (quiz.choices[1].imageLink == undefined ? null : quiz.choices[1].imageLink);
      examquiz.examOptionImage3 = quiz.choices[2] == undefined ? null : (quiz.choices[2].image == undefined ? null : quiz.choices[2].image);;
      examquiz.examOptionImageURL3 = quiz.choices[2] == undefined ? null : (quiz.choices[2].imageLink == undefined ? null : quiz.choices[2].imageLink);
      examquiz.examOptionImage4 = quiz.choices[3] == undefined ? null : (quiz.choices[0].image == undefined ? null : quiz.choices[3].image);
      examquiz.examOptionImageURL4 = quiz.choices[3] == undefined ? null : (quiz.choices[3].imageLink == undefined ? null : quiz.choices[3].imageLink);
      examquiz.examOptionImage5 = quiz.choices[4] == undefined ? null : (quiz.choices[4].image == undefined ? null : quiz.choices[4].image);
      examquiz.examOptionImageURL5 = quiz.choices[4] == undefined ? null : (quiz.choices[4].imageLink == undefined ? null : quiz.choices[4].imageLink);
      examquiz.examTagTopic = quiz.topicId;
      examquiz.quizId = quiz.quizId.toString();
      examquiz.examTime = quiz.time;
      var savedCourse = JSON.parse(localStorage.getItem("course"));
      examquiz.courseId = savedCourse.courseId;
      examquiz.isBlocked = false;
      this.examQuizService.addToQuizExam(examquiz);
    }
    else{
     this.examQuizService.removeFromQuizExam(quiz.quizId);
    }
  }
  makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
  charactersLength)));
   }
   return result.join('');
  }
  check(id){
    return this.examQuizService.quizExam.find(x => x.quizId == id);
  }
}
