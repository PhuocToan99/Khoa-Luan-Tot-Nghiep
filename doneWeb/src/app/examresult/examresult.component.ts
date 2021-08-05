import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { Router } from '@angular/router';
import { ImageloadService } from '../services/imageload.service';
import { AccountInLesson } from '../model/accountinlesson';
import { AccountinlessonService } from '../services/accountinlesson.service';
import { ExamquizserviceService } from '../services/examquizservice.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { Certificate } from '../model/certificate';
import { CertificateService } from '../services/certificate.service';
import { Course } from '../model/course';
import { CourseService } from '../services/course.service';
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
  errorString = "null";
  currentAccount;
  course:Course = new Course();
  constructor(public quizService: QuizService,private router: Router,public imageService: ImageloadService, public accountinlessonService:AccountinlessonService,
    public examQuizService: ExamquizserviceService,private datePipe: DatePipe,private notificationService: NotificationService,
    private certificateService:CertificateService,private courseService:CourseService) { 
    this.user = JSON.parse(localStorage.getItem('currentAccount'));
    this.username = this.user.username;
    this.accountId = this.user.accountId;
    this.totalQuiz = parseInt(localStorage.getItem('totalQuiz'));
    this.quizid = parseInt(localStorage.getItem('quizid')).toString();
    this.currentAccount = localStorage.getItem("currentAccount");
    if(this.currentAccount == undefined || this.currentAccount == null){
      this.router.navigate(['login']);
    }
    if (parseInt(localStorage.getItem('qnProgress')) == this.totalQuiz) {
      this.examQuizService.seconds = parseInt(localStorage.getItem('seconds'));
      this.examQuizService.qnProgress = parseInt(localStorage.getItem('qnProgress'));
      this.examQuizService.qns = JSON.parse(localStorage.getItem('qns'));
          this.examQuizService.correctAnswerCount = 0;
          var i = 0;
          this.examQuizService.qns.forEach(e => {
            if (this.examQuizService.qns[i].answer == this.examQuizService.qns[i].examIsCorrect){
              this.examQuizService.correctAnswerCount++;
            }
            i++;
          });
    }
    else
      this.router.navigate(['/exam/'+this.quizid]);
  }

  ngOnInit(): void {
  }
  async OnSubmit() {
      var result : AccountInLesson = new AccountInLesson();
      result.accountId = localStorage.getItem("accountId");
      result.result = this.examQuizService.correctAnswerCount +"/"+ this.examQuizService.qns.length;
      result.lastTaken = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      result.examQuizCode = localStorage.getItem("quizCode");
      result.quizName = this.examQuizService.qns[0].examQuizName;
      var isComplete = (this.examQuizService.correctAnswerCount > this.examQuizService.qns.length*0.8) ? true : false;
      result.isCompleted = isComplete;
      await this.accountinlessonService.postaccountincourse(result);
      let isFinal = localStorage.getItem("isFinalQuiz");
      let id = localStorage.getItem("courseId");
      this.course = await this.courseService.getcourse(id) as Course;
      if(isComplete && isFinal =="true" && this.course.accountId.toString() != result.accountId){
        let certificate = new Certificate();
        certificate.accountId = localStorage.getItem("accountId");
        certificate.courseId = localStorage.getItem("courseId");
        certificate.getDate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
        var addCertificateResult = await this.certificateService.postcertificate(certificate);
      }
      localStorage.removeItem('qnProgress');
      localStorage.removeItem('qns');
      localStorage.removeItem('seconds');
      localStorage.removeItem('quizid');
      localStorage.removeItem('quizCode');
      localStorage.removeItem('isFinalQuiz');
      if(isComplete && isFinal =="true" && addCertificateResult != undefined && addCertificateResult != null && this.course.accountId.toString() != result.accountId){
        this.notificationService.showNotification("Congratulations, you have successfully get your certificate for this course.You can view your certificates in 'My Certificates' page","Certificate Exam Complete",1500);
        alert("You have been successfully get certificate for this course");
      }
      else{
        this.notificationService.showNotification("Your result have been save","Exam Complete",1500);
      }
      this.router.navigate(['category/'+id]);
  }

  async restart() {
    var result : AccountInLesson = new AccountInLesson();
    result.accountId = localStorage.getItem("accountId");
    result.result = this.examQuizService.correctAnswerCount +"/"+ this.examQuizService.qns.length;
    result.lastTaken = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    result.examQuizCode = localStorage.getItem("quizCode");
    result.quizName = this.examQuizService.qns[0].examQuizName;
    var isComplete = (this.examQuizService.correctAnswerCount > this.examQuizService.qns.length*0.8) ? true : false;
    result.isCompleted = isComplete;
    await this.accountinlessonService.postaccountincourse(result);
    let isFinal = localStorage.getItem("isFinalQuiz");
    if(isComplete && isFinal =="true"){
      let certificate = new Certificate();
      certificate.accountId = localStorage.getItem("accountId");
      certificate.courseId = localStorage.getItem("courseId");
      certificate.getDate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      var addCertificateResult = await this.certificateService.postcertificate(certificate);
    }
    localStorage.setItem('qnProgress', "0");
    localStorage.setItem('qns', "");
    localStorage.setItem('seconds', "0");
    localStorage.setItem('quizid', "");
    // this.notificationService.showNotification("Your result have been save","Exam Complete",1500);
    let id = localStorage.getItem("courseId");
    this.course = await this.courseService.getcourse(id) as Course;
    if(isComplete && isFinal =="true" && addCertificateResult != undefined && addCertificateResult != null && this.course.accountId.toString() != result.accountId){
      this.notificationService.showNotification("Congratulations, you have successfully get your certificate for this course.You can view your certificates in 'My Certificates' page","Certificate Exam Complete",1500);
      alert("You have been successfully get certificate for this course");
    }
    else{
      this.notificationService.showNotification("Your result have been save","Exam Complete",1500);
    }
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
