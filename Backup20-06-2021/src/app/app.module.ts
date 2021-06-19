import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './_layout/header/header.component';
import { FooterComponent } from './_layout/footer/footer.component';
import {appRoutes} from './app.routes';
import { AboutComponent } from './about/about.component';
import { BlogdetailsComponent } from './blogdetails/blogdetails.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DefaultModule } from './layout/default/default.module';
import { ProfileComponent } from './profile/profile.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
import { QuantityControlComponent } from './shoppingcart/quantity-control/quantity-control.component';
import { CommonModule } from '@angular/common';  
import { CartPopupComponent } from './shoppingcart/cart-popup/cart-popup.component';
import { CategoryComponent } from './category/category.component';
import { CartService } from './services/cart.service';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { CoursepublishComponent } from './coursepublish/coursepublish.component';
import { CoursedetailComponent } from './coursedetail/coursedetail.component';
import { TopicdialogComponent } from './dialog/topicdialog/topicdialog.component';
import { AddcoursedetailComponent } from './addcoursedetail/addcoursedetail.component';
import {MatDialogModule} from '@angular/material/dialog';
import { SubtopicdialogComponent } from './dialog/subtopicdialog/subtopicdialog.component';
import { MatSelectModule } from '@angular/material/select';
import { LessondialogComponent } from './dialog/lessondialog/lessondialog.component';
import { CategorydetailComponent } from './categorydetail/categorydetail.component';
import { MycourseComponent } from './mycourse/mycourse.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InstructorbalanceComponent } from './modules/instructorbalance/instructorbalance.component';

import {DataTablesModule} from 'angular-datatables';
import { ChartsModule } from 'ng2-charts';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';


import {HttpModule} from "@angular/http";

import { RouterModule } from '@angular/router';
import { NgxY2PlayerModule } from 'ngx-y2-player';
import { SearchComponent } from './search/search.component';
import { BecomeinstructorComponent } from './becomeinstructor/becomeinstructor.component';
import { MeetComponent } from './meet/meet.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { RegisterComponent } from './register/register.component';
import { ExcelreaderComponent } from './excelreader/excelreader.component';
import { CoursedialogComponent } from './dialog/coursedialog/coursedialog.component';
import { ManagepublishcourseComponent } from './managepublishcourse/managepublishcourse.component';
import { QuizdialogComponent } from './dialog/quizdialog/quizdialog.component';
import { QuestionpooldialogComponent } from './dialog/questionpooldialog/questionpooldialog.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { UploadimagedialogComponent } from './dialog/uploadimagedialog/uploadimagedialog.component';
import { ToastrModule } from 'ngx-toastr';
import { QuestionpooldetailComponent } from './questionpooldetail/questionpooldetail.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ExamComponent } from './exam/exam.component';
import { ExamresultComponent } from './examresult/examresult.component';
import { QuestionpoolmanagepageComponent } from './questionpoolmanagepage/questionpoolmanagepage.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ExamquizdialogComponent } from './dialog/examquizdialog/examquizdialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CreateexamComponent } from './createexam/createexam.component';
import { InvoicehistoryComponent } from './invoicehistory/invoicehistory.component';
import { InvoicedialogComponent } from './dialog/invoicedialog/invoicedialog.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { RatingdialogComponent } from './dialog/ratingdialog/ratingdialog.component';
import { AlertComponent } from './questionpoolmanagepage/alert/alert.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    BlogdetailsComponent,
    BlogComponent,
    ContactComponent,
    LoginComponent,
    AppLayoutComponent,
    ProfileComponent,
    ShoppingcartComponent,
    QuantityControlComponent,
    CartPopupComponent,
    CategoryComponent,
    CoursepublishComponent,
    CoursedetailComponent,
    TopicdialogComponent,
    AddcoursedetailComponent,
    SubtopicdialogComponent,
    LessondialogComponent,
    CategorydetailComponent,
    MycourseComponent,
    InstructorbalanceComponent,
    SearchComponent,
    SearchComponent,
    BecomeinstructorComponent,
    MeetComponent,
    AccessdeniedComponent,
    RegisterComponent,
    ExcelreaderComponent,
    CoursedialogComponent,
    ManagepublishcourseComponent,
    QuizdialogComponent,
    QuestionpooldialogComponent,
    UploadimagedialogComponent,
    QuestionpooldetailComponent,
    ExamComponent,
    ExamresultComponent,
    QuestionpoolmanagepageComponent,
    ExamquizdialogComponent,
    CreateexamComponent,
    InvoicehistoryComponent,
    InvoicedialogComponent,
    RatingdialogComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    appRoutes,
    NgbModule,
    BrowserAnimationsModule,
    DefaultModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatSnackBarModule,
    MatSidenavModule,
    HttpClientModule,
    ScrollingModule,
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    NgxPaginationModule,
    DataTablesModule,
    ChartsModule,
    MatExpansionModule,
    MatButtonModule,
    RouterModule,
    NgxY2PlayerModule,
    HttpModule,
    MatGridListModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatCheckboxModule,
    CKEditorModule,
    MatAutocompleteModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }) 
  ],
  providers: [CartService,DatePipe],
  bootstrap: [AppComponent],
  exports: [ RouterModule,MatGridListModule ]
})
export class AppModule { }
