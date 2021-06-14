import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../model/course';
import { DatePipe } from '@angular/common';
import { CourseService } from '../services/course.service';
import { AuthenticationService } from '../services/authentication.service';
import { Account } from  '../model/Account';
@Component({
  selector: 'app-coursepublish',
  templateUrl: './coursepublish.component.html',
  styleUrls: ['./coursepublish.component.css']
})
export class CoursepublishComponent implements OnInit {
  public CourseName: string;
  public Rating: number = 0.0;  
  public NumberOfVoters: number = 0.0; 
  public NumberOfParticipants: number = 0.0;
  public Price: number = 0.0;    
  public Description :string;
  public CourseHastag: string;
  public hastags = ['C - C# - C++', 'Java Basic','Java Advanced','Python - C','IOS - Android','AI - VR - IOT','Javascript','Gear - Hardware','UX - UI - Designer','Photoshop','SEO Service','Frontend','Framework'];
  public CourseLevel :string;
  public levels = ['Basic', 'Tutorial','Advance','Deep Learning','Guide'];
  public CourseDuration: string;
  public ThumbnailImage;
  public StartDate;
  public LastUpdate;
  currentAccount: Account;
  constructor(private router: Router, private courseservice: CourseService,private datePipe: DatePipe,private authenticationService: AuthenticationService) { 
    this.StartDate = datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    this.LastUpdate= datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
    this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
  }

  ngOnInit(): void {
  }
  handleFileInput(files: FileList) {
    console.log(files.item(0));
    if (files.item(0))
      this.ThumbnailImage = files.item(0);  //Lấy file uplload hình gán vào biến
  }
  base64ToBlob(base64: string, type: string) 
  {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    } 
    return new Blob([bytes], { type: type });
  };
  public createCourse = async () => {
    try {
      let course = new Course();
      course.courseName = this.CourseName;
      course.rating = this.Rating;
      course.numberOfVoters = this.NumberOfVoters;
      course.numberOfParticipants = this.NumberOfParticipants;
      course.price = this.Price;
      course.startDate = this.StartDate;
      course.lastUpdate = this.LastUpdate;
      course.courseDuration = this.CourseDuration;
      course.description = this.Description;
      course.thumbnailImage = this.ThumbnailImage;
      course.hastag = this.CourseHastag;
      course.level = this.CourseLevel;
      course.accountId = this.currentAccount.accountId;
      course.isActive = true;
      course.lessonNumber = 0;
      const result2 = await this.courseservice.postcourse(course);
      console.log(result2);
      localStorage.setItem("course", JSON.stringify(result2));
      this.router.navigateByUrl('/addcoursedetail');
    }
    catch (e) {
      alert('Publish course failed');
    }
  };
}
