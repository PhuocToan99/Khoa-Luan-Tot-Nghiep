import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import { Params } from '@angular/router';
// import { Exam } from '../model/quiz';
// import { QuizService } from '../services/quiz.service';
import { ImageloadService } from '../services/imageload.service';
import { ExamQuiz } from '../model/examquiz';
import { ExamquizserviceService } from '../services/examquizservice.service';
@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  id:any;
  // quizlist: Exam[] = [];
  quiztime: number;
  totalQuiz: number = 0;
  errorString = "null";
  
  cardImageBase64ImageQuestion: any;
  cardImageBase64Image1: any;
  cardImageBase64Image2: any;
  cardImageBase64Image3: any;
  cardImageBase64Image4: any;
  quizCode;
  examQuizList : ExamQuiz[] =[];
  currentAccount;
  constructor(private route: ActivatedRoute,private router: Router,public imageService: ImageloadService,public examQuizService: ExamquizserviceService) { 
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        localStorage.setItem('quizid', this.id);
        this.examQuizService.seconds = 0;
        localStorage.setItem('seconds', this.examQuizService.seconds.toString());
      }
    );
    this.quizCode = localStorage.getItem("quizCode");
    this.currentAccount = localStorage.getItem("currentAccount");
    if(this.currentAccount == undefined || this.currentAccount == null){
      this.router.navigate(['login']);
    }
  }

  async ngOnInit() {
    if (parseInt(localStorage.getItem('seconds')) > 0) {
      this.examQuizService.seconds = parseInt(localStorage.getItem('seconds'));
      this.examQuizService.qnProgress = parseInt(localStorage.getItem('qnProgress'));
      this.examQuizService.qns = JSON.parse(localStorage.getItem('qns'));
      if (this.examQuizService.qnProgress == this.totalQuiz || this.examQuizService.seconds >= this.quiztime)
        this.router.navigate(['/examresult']);
      else
        this.startTimer();
    }
    else {
      // this.quizService.seconds = 0;
      this.examQuizService.qnProgress = 0;
      // await this.getQuizList(this.id);
      await this.getQuizList();
      this.examQuizService.qns = this.examQuizList;
      // this.quizService.qns = this.quizlist;
      console.log(this.examQuizService.qns);
      this.startTimer();
    }
    if(this.quizCode != undefined){
      this.examQuizService.quizExam = await this.examQuizService.getExamByExamCode(this.quizCode) as ExamQuiz[];
    }
  }
  

  startTimer() {
    this.examQuizService.timer = setInterval(() => {
      this.examQuizService.seconds++;
      localStorage.setItem('seconds', this.examQuizService.seconds.toString());
    }, 1000);
  }

  Answer(qID, choice) {
    this.examQuizService.qns[this.examQuizService.qnProgress].answer = choice;
    console.log(this.examQuizService.qns);
    localStorage.setItem('qns', JSON.stringify(this.examQuizService.qns));
    this.examQuizService.qnProgress++;
    localStorage.setItem('qnProgress', this.examQuizService.qnProgress.toString());
    if (this.examQuizService.qnProgress == this.totalQuiz || this.examQuizService.seconds >= this.quiztime) {
      clearInterval(this.examQuizService.timer);
      this.router.navigate(['/examresult']);
    }
  }
  async getQuizList(){
    this.examQuizList = await this.examQuizService.getExamByExamCode(this.quizCode) as ExamQuiz[];
    this.totalQuiz = this.examQuizList.length;
    localStorage.setItem('totalQuiz', this.totalQuiz.toString());
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
