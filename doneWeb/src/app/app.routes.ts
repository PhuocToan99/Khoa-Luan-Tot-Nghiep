import {Routes,RouterModule} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { DefaultComponent } from './layout/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component'
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
import { CategoryComponent } from './category/category.component';
import { CoursepublishComponent } from './coursepublish/coursepublish.component';
import { CoursedetailComponent } from './coursedetail/coursedetail.component';
import { CategorydetailComponent} from './categorydetail/categorydetail.component';
import { AddcoursedetailComponent } from './addcoursedetail/addcoursedetail.component';
import { RegisterComponent } from './register/register.component';
import { MycourseComponent } from './mycourse/mycourse.component';
import { InstructorbalanceComponent } from './modules/instructorbalance/instructorbalance.component';
import { LessonComponent } from './lesson/lesson.component';
import { SearchComponent } from './search/search.component';
import { BecomeinstructorComponent } from './becomeinstructor/becomeinstructor.component';
import { MeetComponent } from './meet/meet.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { CustomguardGuard } from './customguard.guard';
import { ManageuserComponent } from './modules/manageuser/manageuser.component';
import { ManagecourseComponent } from './modules/managecourse/managecourse.component';
import { ManagepublishcourseComponent } from './managepublishcourse/managepublishcourse.component';
import { QuestionpooldetailComponent } from './questionpooldetail/questionpooldetail.component';
import { ExamComponent } from './exam/exam.component';
import { ExamresultComponent } from './examresult/examresult.component';
import { QuestionpoolmanagepageComponent } from './questionpoolmanagepage/questionpoolmanagepage.component';
import { CreateexamComponent } from './createexam/createexam.component';
import { InvoicehistoryComponent } from './invoicehistory/invoicehistory.component';
import { CertificateComponent } from './certificate/certificate.component';
import { MycertificateComponent } from './mycertificate/mycertificate.component';
export const routing: Routes =[
  {
    path: '',
    component: AppLayoutComponent,
    children: [
  {path: '',component: HomeComponent},
  {path: 'contact',component: ContactComponent},
  {path: 'profile',component: ProfileComponent},
  {path: 'category',component: CategoryComponent},
  {path: 'coursedetail/:id',component: CoursedetailComponent},
  {path: 'category/:id',component: CategorydetailComponent},
  {path: 'lesson/:id',component: LessonComponent},
  {path: 'mycourse',component: MycourseComponent, canActivate: [CustomguardGuard],data: {role: 'user',role2:'instructor'}},
  {path: 'managepublishcourse',component: ManagepublishcourseComponent, canActivate: [CustomguardGuard],data: {role: 'instructor'}},
  { path: 'search',component: SearchComponent },
  { path: 'becomeinstructor',component: BecomeinstructorComponent, canActivate: [CustomguardGuard],data: {role: 'user'}},
  { path: 'invoicehistory',component: InvoicehistoryComponent, canActivate: [CustomguardGuard],data: {role: 'user',role2:'instructor'}},
  {path: 'certificate/:id',component: CertificateComponent, canActivate: [CustomguardGuard],data: {role: 'user',role2:'instructor'}},
  {path: 'mycertificate',component: MycertificateComponent, canActivate: [CustomguardGuard],data: {role: 'user',role2:'instructor'}}
  ]
  },
  { path:'cart',component: ShoppingcartComponent},
  {path: 'login',component: LoginComponent},
  {
    path: 'admin',
    component: DefaultComponent,
    canActivate: [CustomguardGuard],
    data: {role: 'admin'},
    children: [{
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'instructorbalance',
    component: InstructorbalanceComponent
  },
  {
    path: 'manageuser',
    component: ManageuserComponent
  },
  {
    path: 'managecourse',
    component: ManagecourseComponent
  }
]
  },
  {path: 'publishcourse',component: CoursepublishComponent, canActivate: [CustomguardGuard],data: {role: 'instructor'}},
  {path: 'addcoursedetail',component: AddcoursedetailComponent, canActivate: [CustomguardGuard],data: {role: 'instructor'}},
  {path: 'register',component: RegisterComponent},
  {path: 'accessdenied',component: AccessdeniedComponent},
  { path: 'meet',component: MeetComponent, canActivate: [CustomguardGuard],data: {role: 'instructor'}},
  {path: 'questionpooldetail/:id',component: QuestionpooldetailComponent,canActivate: [CustomguardGuard],data: {role: 'instructor'}},
  {path: 'exam/:id',component: ExamComponent},
  {path: 'examresult',component: ExamresultComponent},
  {path: 'managequestionpool',component: QuestionpoolmanagepageComponent, canActivate: [CustomguardGuard],data: {role: 'instructor'}},
  {path: 'createexam',component: CreateexamComponent, canActivate: [CustomguardGuard],data: {role: 'instructor'}},
]
export const appRoutes = RouterModule.forRoot(routing);
