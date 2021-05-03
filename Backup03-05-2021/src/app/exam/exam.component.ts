import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import { Params } from '@angular/router';
import { Quiz } from '../model/quiz';
import { QuizService } from '../services/quiz.service';
@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  id:any;
  quizlist: Quiz[] = [];
  quiztime: number;
  totalQuiz: number = 0;
  cardImageBase64ImageQuestion: any;
  cardImageBase64Image1: any;
  cardImageBase64Image2: any;
  cardImageBase64Image3: any;
  cardImageBase64Image4: any;
  constructor(private route: ActivatedRoute,public quizService: QuizService,private router: Router) { 
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        localStorage.setItem('quizid', this.id);
        this.quizService.seconds = 0;
        localStorage.setItem('seconds', this.quizService.seconds.toString());
      }
    );
  }

  async ngOnInit() {
    if (parseInt(localStorage.getItem('seconds')) > 0) {
      this.quizService.seconds = parseInt(localStorage.getItem('seconds'));
      this.quizService.qnProgress = parseInt(localStorage.getItem('qnProgress'));
      this.quizService.qns = JSON.parse(localStorage.getItem('qns'));
      if (this.quizService.qnProgress == this.totalQuiz || this.quizService.seconds >= this.quiztime)
        this.router.navigate(['/examresult']);
      else
        this.startTimer();
    }
    else {
      // this.quizService.seconds = 0;
      this.quizService.qnProgress = 0;
      await this.getQuizList(this.id);
      this.quizService.qns = this.quizlist;
      console.log(this.quizService.qns);
      this.startTimer();
    }
  }
  

  startTimer() {
    this.quizService.timer = setInterval(() => {
      this.quizService.seconds++;
      localStorage.setItem('seconds', this.quizService.seconds.toString());
    }, 1000);
  }

  Answer(qID, choice) {
    this.quizService.qns[this.quizService.qnProgress].answer = choice;
    localStorage.setItem('qns', JSON.stringify(this.quizService.qns));
    this.quizService.qnProgress++;
    localStorage.setItem('qnProgress', this.quizService.qnProgress.toString());
    if (this.quizService.qnProgress == this.totalQuiz || this.quizService.seconds >= this.quiztime) {
      clearInterval(this.quizService.timer);
      this.router.navigate(['/examresult']);
    }
  }
  async getQuizList(id){
    var result = await this.quizService.getQuizOfQuestionpool(id) as Quiz[];
    console.log(result);
    result.forEach((item, index) => {
      if (this.quizlist.findIndex(i => i.quizId == item.quizId) === -1) 
      {
          this.quiztime += item.time;
          this.quizlist.push(item)
      }
    });
    this.totalQuiz = this.quizlist.length;
    localStorage.setItem('totalQuiz', this.totalQuiz.toString());    
    console.log(this.quizlist);
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
