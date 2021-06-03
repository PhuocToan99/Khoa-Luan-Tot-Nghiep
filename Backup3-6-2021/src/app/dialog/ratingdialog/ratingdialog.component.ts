import { CommentDialogData } from '../shared/sharedata';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
@Component({
  selector: 'app-ratingdialog',
  templateUrl: './ratingdialog.component.html',
  styleUrls: ['./ratingdialog.component.css']
})
export class RatingdialogComponent implements OnInit {
  start1: boolean= false;
  start2:boolean = false;
  start3 : boolean= false;
  start4 : boolean= false;
  start5 : boolean= false;
  notrating:boolean = false;
  constructor(public dialogRef: MatDialogRef<RatingdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentDialogData) { }

  ngOnInit(): void {
    this.notrating = (!this.data.rating) ? true : false;
    this.start1 = (this.data.rating <= 1) ? true : false;
    this.start2 = ((1 < this.data.rating) && (this.data.rating<= 2)) ? true : false;
    this.start3 = ((2 < this.data.rating) && (this.data.rating<= 3)) ? true : false;
    this.start4 = ((3 < this.data.rating) && (this.data.rating<= 4)) ? true : false;
    this.start5 = ((4 < this.data.rating) && (this.data.rating<= 5)) ? true : false;
  }

}
