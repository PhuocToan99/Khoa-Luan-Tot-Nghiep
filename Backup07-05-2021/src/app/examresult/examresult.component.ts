import { Component, OnInit } from '@angular/core';
import { Quiz } from '../model/quiz';
import { QuizService } from '../services/quiz.service';
import { Router } from '@angular/router';
import { ImageloadService } from '../services/imageload.service';
@Component({
  selector: 'app-examresult',
  templateUrl: './examresult.component.html',
  styleUrls: ['./examresult.component.css']
})
export class ExamresultComponent implements OnInit {
  user;
  username;
  accountId;
  quizid;
  totalQuiz;
  cardImageBase64ImageQuestion: any;
  cardImageBase64Image1: any;
  cardImageBase64Image2: any;
  cardImageBase64Image3: any;
  cardImageBase64Image4: any;
  constructor(public quizService: QuizService,private router: Router,public imageService: ImageloadService) { 
    this.user = JSON.parse(localStorage.getItem('currentAccount'));
    this.username = this.user.username;
    this.accountId = this.user.accountId;
    this.totalQuiz = parseInt(localStorage.getItem('totalQuiz'));
    this.quizid = parseInt(localStorage.getItem('quizid')).toString();
    if (parseInt(localStorage.getItem('qnProgress')) == this.totalQuiz) {
      this.quizService.seconds = parseInt(localStorage.getItem('seconds'));
      this.quizService.qnProgress = parseInt(localStorage.getItem('qnProgress'));
      this.quizService.qns = JSON.parse(localStorage.getItem('qns'));
          this.quizService.correctAnswerCount = 0;
          var i = 0;
          this.quizService.qns.forEach(e => {
            if (this.quizService.qns[i].choices[e.answer].isCorrect == true){
              this.quizService.correctAnswerCount++;
            }
            i++;
          });
    }
    else
      this.router.navigate(['/exam/'+this.quizid]);
  }

  ngOnInit(): void {
  }
  OnSubmit() {
    this.quizService.submitScore().subscribe(() => {
      this.restart();
    });
  }

  restart() {
    localStorage.setItem('qnProgress', "0");
    localStorage.setItem('qns', "");
    localStorage.setItem('seconds', "0");
    localStorage.setItem('quizid', "");
    this.router.navigate(['/exam/'+this.quizid]);
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
