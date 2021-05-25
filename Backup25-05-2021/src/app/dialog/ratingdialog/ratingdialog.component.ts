import { CommentDialogData } from '../shared/sharedata';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
@Component({
  selector: 'app-ratingdialog',
  templateUrl: './ratingdialog.component.html',
  styleUrls: ['./ratingdialog.component.css']
})
export class RatingdialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RatingdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentDialogData) { }

  ngOnInit(): void {
  }

}
