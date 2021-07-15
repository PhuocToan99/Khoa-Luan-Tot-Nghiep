import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../questionpoolmanagepage.component';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  confirmDelete:boolean= false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { 
    this.confirmDelete = (data.type) ? true : false;
  }

  ngOnInit(): void {
  }
  change(state){
    this.data.confirm = state;
  }
}
