import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { AccountincourseService } from '../services/accountincourse.service';
import { AuthenticationService } from '../services/authentication.service';
import { CourseService } from '../services/course.service';
import { ExamquizserviceService } from '../services/examquizservice.service';
import { User, InstructorProfile} from '../model/user';
import { Course,CourseDataSet } from '../model/course';
import { Account } from '../model/Account';
import { ExamQuiz } from '../model/examquiz';
import { AccountInCourse } from '../model/accountincourse';
import { DatePipe } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { ImageloadService } from '../services/imageload.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  accounts: Array<Account>
  public ID: string = ''
  public FirstName: string = ''
  public LastName: string = ''
  public Email: string = ''
  public PhoneNumber: string = ''
  public AvatarPath: string = ''
  public Balance: number;
  public LastLogOnDate;
  public dataset: User[]
  public accountdataset: Account[]
  public haveAvatar: boolean = false;
  public haveBalance: boolean = false;
  public phoneInvalid: boolean = true;
  public firstNameInvalid: boolean = true;
  public lastNameInvalid: boolean = true;
  public emailInvalid: boolean = true;
  public CourseBuyCount:number = 0;
  public CoursePublishCount:number = 0;
  public QuizAttempCount:number = 0;
  currentAccount: Account;
  isInstructor:boolean;
  description:string ="";
  placeholder:string = "";
  instructorImage;
  courseDataSet:CourseDataSet[] = [];
  instructorInfo:InstructorProfile = new InstructorProfile();
  id;
  isContentToggled: boolean[] = [];
  nonEditedContent: string;
  public limit: number = 20;
  public completeWords: true;
  constructor(private service: UserService, private accService: AuthenticationService, private chRef: ChangeDetectorRef,private datePipe: DatePipe, private router: Router,
    private imageLoadService:ImageloadService,private accountInCourseService:AccountincourseService,
    private courseService:CourseService,private examQuizService:ExamquizserviceService, private route: ActivatedRoute) {
    this.accService.currentAccount.subscribe(x => this.currentAccount = x);
    if( this.currentAccount == null ) this.router.navigate(['/login']);
   }

  async ngOnInit(){
    var instructor;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams
    .subscribe(params => {
      instructor = params["isInstructor"] || null;
      this.id = params["id"] || null;
    });
    this.isInstructor = (instructor) ? true : false;
    this.isInstructor = (this.id == this.currentAccount.accountId || !this.id) ? false : true; 
    console.log(this.isInstructor);
    await this.getuser();
    this.chRef.detectChanges();
  }
  public getuser = async () => {
        if(this.currentAccount.role == "instructor"){
          this.haveBalance = true;
        }
        if(this.currentAccount != undefined){
        if(!this.isInstructor){
        this.user  = await this.service.getuser(this.currentAccount.userId) as User;
        this.haveAvatar = true;
        this.user.account = this.currentAccount;
        this.Email = this.user.email;
        this.FirstName = this.user.firstName;
        this.LastName = this.user.lastName;
        this.PhoneNumber = this.user.phoneNumber;
        this.placeholder = (this.user.description) ? this.user.description : "A few words about you ...";
        var buycount = await this.accountInCourseService.getaccountincoursesByAccountId(this.currentAccount.accountId,1) as AccountInCourse[];
        this.CourseBuyCount = buycount.length; 
        var publishcount = await this.courseService.getCourseByAccountId(this.currentAccount.accountId) as Course[];
        this.CoursePublishCount = publishcount.length; 
        var examquizcount = await this.examQuizService.getExamQuizAttempByAccountId(this.currentAccount.accountId) as ExamQuiz[];
        this.QuizAttempCount = examquizcount.length; 
        }
        else{
          // this.instructorInfo = new InstructorProfile();
          this.instructorInfo = await this.service.getInstructorInfo(this.id) as InstructorProfile;
          this.instructorImage = this.loadimage(this.instructorInfo.avatarPath);
          var course = await this.courseService.getInstructorCourse(this.id) as Course[];
          if(course.length > 0){
            course.forEach(e => {
              var courseData: CourseDataSet = new CourseDataSet();
              courseData.course = e;
              courseData.nonFormatedDescription = e.description;
              courseData.course.description = this.formatContent(e.description);
              courseData.rating = Math.floor(e.rating);
              courseData.check = ((e.rating - courseData.rating) >= 0.5) ? true : false;
              this.courseDataSet.push(courseData);
              this.isContentToggled.push(true);
              })
          }
        }
        }
  }
public loadimage(url){
  return this.imageLoadService.getImageSource(url);
}
  reload= async () =>{
    this.accService.currentAccount.subscribe(x => this.currentAccount = x);
    await this.getuser(); 
  }
  async update(){
    this.checkEmail();
    this.checkFirstName();
    this.checkPhonenumber();
    this.checkEmail();
    this.LastLogOnDate= this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
      try 
      {
        var userData: User = new User();
        userData = this.user;
          if(this.firstNameInvalid){
            userData.firstName = this.FirstName;
            }
            else{
              alert("Invalid Firstname");
            }

      
          if(this.firstNameInvalid){
            userData.lastName = this.LastName;
          }
          else{
            alert("Invalid Lastname");
          }

        
          if(this.emailInvalid){
            userData.email = this.Email;
          }
          else{
            alert("Email Invalid");
          }
    
      
            if(this.phoneInvalid){
              userData.phoneNumber = this.PhoneNumber;
            }
            else{
              alert("Invalid Phonenumber");
            }
          userData.description = (this.description) ? this.description : "";
        console.log(userData);
       await this.service.updateusers(userData.userId,userData);
      this.reload();
      }
      catch (e) {
        console.log(e);
      }
  }
  checkPhonenumber(){
    if(this.PhoneNumber.match(/^[0-9]+$/) && this.PhoneNumber.length >= 6){
     return this.phoneInvalid = true;
    }
    return this.phoneInvalid = false;
  }
  checkFirstName(){
    if(this.FirstName.match(/^[A-Za-z ]+$/) && this.FirstName.length >= 1){
      return this.firstNameInvalid = true;
      }
      return this.firstNameInvalid = false;
  }
  checkLastName(){
    if(this.LastName.match(/^[A-Za-z ]+$/) && this.LastName.length >= 1){
      return this.lastNameInvalid = true;
      }
      return this.lastNameInvalid= false;
  }
  checkEmail(){
    var result = this.Email.slice(-10);
    if(result == "@gmail.com"){
      return this.emailInvalid = true;
      }
      return this.emailInvalid= false;
  }
  viewdetail = async (id,course) => {
    await this.courseService.updatecourseviewcount(id,course);
    this.router.navigate(['/category', id], { relativeTo: this.route });
  }
  toggleContent(index) {
    this.courseDataSet[index].course.description = this.isContentToggled[index] ? this.courseDataSet[index].nonFormatedDescription : this.formatContent(this.courseDataSet[index].nonFormatedDescription);
  }

  formatContent(content: string) {
    if (this.completeWords) {
      this.limit = content.substr(0, this.limit).lastIndexOf(' ');
    }
    return `${content.substr(0, this.limit)}...`;
  }
}
